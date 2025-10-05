// src/utils/gameService.js
import { supabase } from './supabase';

const gameService = {
  
  // ==========================================
  // 1. CREATE ROOM
  // ==========================================
  async createRoom(hostNickname) {
    try {
      // Generate unique room code
      const roomCode = this.generateRoomCode();
      
      // Generate a temporary UUID for the host (since we're not using auth)
      const hostId = crypto.randomUUID();
      
      // Create room
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert([{
          room_code: roomCode,
          host_id: hostId,
          status: 'waiting',
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
        }])
        .select()
        .single();
      
      if (roomError) {
        console.error('Room creation error:', roomError);
        throw roomError;
      }
      
      // Add host as first player
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert([{
          room_id: room.id,
          nickname: hostNickname,
          is_host: true,
          is_active: true
        }])
        .select()
        .single();
      
      if (playerError) {
        console.error('Player creation error:', playerError);
        throw playerError;
      }
      
      // Start heartbeat for host
      await this.sendHeartbeat(player.id);
      
      console.log('✅ Room created:', room);
      console.log('✅ Host player created:', player);
      
      return { room, player };
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },
  
  // ==========================================
  // 2. JOIN ROOM
  // ==========================================
  async joinRoom(roomCode, nickname) {
    try {
      // Find room
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .single();
      
      if (roomError || !room) {
        throw new Error('Room not found');
      }
      
      // Check if game already started
      if (room.status !== 'waiting') {
        throw new Error('Game already started');
      }
      
      // Check if room is full
      const { data: existingPlayers, error: countError } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', room.id)
        .eq('is_active', true);
      
      if (countError) throw countError;
      
      if (existingPlayers.length >= room.max_players) {
        throw new Error('Room is full');
      }
      
      // Check if nickname already exists in room
      const nicknameExists = existingPlayers.some(p => p.nickname === nickname);
      if (nicknameExists) {
        throw new Error('Nickname already taken in this room');
      }
      
      // Add player to room
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert([{
          room_id: room.id,
          nickname,
          is_host: false,
          is_active: true
        }])
        .select()
        .single();
      
      if (playerError) {
        console.error('Player join error:', playerError);
        throw playerError;
      }
      
      // Start heartbeat
      await this.sendHeartbeat(player.id);
      
      console.log('✅ Joined room:', room);
      console.log('✅ Player created:', player);
      
      return { room, player };
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  },
  
  // ==========================================
  // 3. START GAME (Select Category & Assign Words)
  // ==========================================
  async startGame(roomId, category, wordCategories) {
    try {
      // Get all active players
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_active', true);
      
      if (playersError) throw playersError;
      
      if (players.length < 3) {
        throw new Error('Need at least 3 players to start');
      }
      
      // Select random word pair
      const categoryWords = wordCategories[category];
      const wordPair = categoryWords[Math.floor(Math.random() * categoryWords.length)];
      
      // Select random liar
      const liarIndex = Math.floor(Math.random() * players.length);
      const liarPlayer = players[liarIndex];
      
      // Update room with game data
      const { error: roomUpdateError } = await supabase
        .from('rooms')
        .update({
          status: 'in_game',
          selected_category: category,
          majority_word: wordPair.majority,
          minority_word: wordPair.minority,
          liar_player_id: liarPlayer.id
        })
        .eq('id', roomId);
      
      if (roomUpdateError) {
        console.error('Room update error:', roomUpdateError);
        throw roomUpdateError;
      }
      
      // Assign words to all players
      for (const player of players) {
        const assignedWord = player.id === liarPlayer.id ? wordPair.minority : wordPair.majority;
        const isLiar = player.id === liarPlayer.id;
        
        await supabase
          .from('players')
          .update({
            assigned_word: assignedWord,
            is_liar: isLiar
          })
          .eq('id', player.id);
      }
      
      console.log('✅ Game started with category:', category);
      console.log('✅ Liar selected:', liarPlayer.nickname);
      
      return {
        category,
        majorityWord: wordPair.majority,
        minorityWord: wordPair.minority,
        liarId: liarPlayer.id
      };
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  },
  
  // ==========================================
  // 4. HEARTBEAT SYSTEM
  // ==========================================
  async sendHeartbeat(playerId) {
    try {
      // Update player's last_seen
      const { error: playerError } = await supabase
        .from('players')
        .update({ 
          last_seen: new Date().toISOString(),
          is_active: true
        })
        .eq('id', playerId);
      
      if (playerError) throw playerError;
      
      // Upsert heartbeat
      const { error: heartbeatError } = await supabase
        .from('player_heartbeats')
        .upsert({
          player_id: playerId,
          last_heartbeat: new Date().toISOString()
        });
      
      if (heartbeatError) throw heartbeatError;
      
      return true;
    } catch (error) {
      console.error('Heartbeat error:', error);
      throw error;
    }
  },
  
  startHeartbeatInterval(playerId) {
    // Send initial heartbeat
    this.sendHeartbeat(playerId);
    
    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(async () => {
      try {
        await this.sendHeartbeat(playerId);
        console.log(`❤️ Heartbeat sent for player ${playerId}`);
      } catch (error) {
        console.error('Heartbeat failed:', error);
        clearInterval(heartbeatInterval);
      }
    }, 30000); // 30 seconds
    
    // Store interval ID for cleanup
    return heartbeatInterval;
  },
  
  // ==========================================
  // 5. REAL-TIME SUBSCRIPTIONS
  // ==========================================
  subscribeToRoom(roomId, callbacks) {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          console.log('🔔 Player change:', payload);
          if (callbacks.onPlayerChange) {
            callbacks.onPlayerChange(payload);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          console.log('🔔 Room update:', payload);
          if (callbacks.onRoomUpdate) {
            callbacks.onRoomUpdate(payload);
          }
        }
      )
      .subscribe();
    
    return channel;
  },
  
  unsubscribeFromRoom(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  },
  
  // ==========================================
  // 6. GET ROOM DATA
  // ==========================================
  async getRoomData(roomId) {
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (roomError) throw roomError;
    
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_active', true)
      .order('joined_at', { ascending: true });
    
    if (playersError) throw playersError;
    
    return { room, players };
  },
  
  async getRoomByCode(roomCode) {
    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .single();
    
    if (error) throw error;
    return room;
  },
  
  async getPlayerWord(playerId) {
    const { data: player, error } = await supabase
      .from('players')
      .select('assigned_word, is_liar')
      .eq('id', playerId)
      .single();
    
    if (error) throw error;
    return player;
  },
  
  // ==========================================
  // 7. LEAVE ROOM
  // ==========================================
  async leaveRoom(playerId) {
    // Mark player as inactive instead of deleting
    const { error } = await supabase
      .from('players')
      .update({ is_active: false })
      .eq('id', playerId);
    
    if (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
    
    console.log('✅ Player marked as inactive:', playerId);
  },
  
  // ==========================================
  // 8. RESET GAME (Play Another Round)
  // ==========================================
  async resetGame(roomId) {
    // Reset room status
    const { error: roomError } = await supabase
      .from('rooms')
      .update({
        status: 'waiting',
        selected_category: null,
        majority_word: null,
        minority_word: null,
        liar_player_id: null
      })
      .eq('id', roomId);
    
    if (roomError) throw roomError;
    
    // Reset player words
    const { error: playerError } = await supabase
      .from('players')
      .update({
        assigned_word: null,
        is_liar: false
      })
      .eq('room_id', roomId);
    
    if (playerError) throw playerError;
    
    console.log('✅ Game reset for room:', roomId);
  },
  
  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },
  
  // Check if room code exists and is valid
  async isRoomCodeValid(roomCode) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, status')
        .eq('room_code', roomCode.toUpperCase())
        .single();
      
      if (error) return false;
      return data !== null && data.status === 'waiting';
    } catch (error) {
      return false;
    }
  }
};

export default gameService;
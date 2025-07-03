import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk: API'den depremleri çekme
export const fetchEarthquakes = createAsyncThunk(
  'earthquake/fetchEarthquakes',
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/deprem/son`);


    console.log(response.data)
    return response.data;
  }
);

const earthquakeSlice = createSlice({
  name: 'earthquake',
  initialState: {
    data: [],
    status: 'idle', 
    error: null,
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEarthquakes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEarthquakes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchEarthquakes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default earthquakeSlice.reducer;

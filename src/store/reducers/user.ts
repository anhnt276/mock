import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../App';

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any | null>) => {
      state.currentUser = action.payload;
    },
  }
});

export const { setUser } = userSlice.actions; 

export default userSlice.reducer;
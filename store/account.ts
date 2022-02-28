import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from '../store'
import { ArkBookmark, ArkFolder, BookmarkType } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface AccountState {
  identity: string
  threadId: string
  loading: boolean
  bookmarks: ArkBookmark[]
  folders: ArkFolder[]
}

const initialState: AccountState = {
  identity: '',
  threadId: '',
  loading: false,
  bookmarks: [],
  folders: [],
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    _createCollection: (state, action: PayloadAction<ArkFolder>) => {
      state.folders.splice(0, 0, action.payload)
      AsyncStorage.setItem('folders', JSON.stringify(state.folders))
    },
    _createBookmark: (state, action: PayloadAction<ArkBookmark>) => {
      state.bookmarks.splice(0, 0, action.payload)
      AsyncStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
    },
    newIdentity: (state, action: PayloadAction<string>) => {
      state.identity = action.payload
    },
    newThreadId: (state, action: PayloadAction<string>) => {
      state.threadId = action.payload
    },
    loadAllCollection: (state, action: PayloadAction<ArkFolder[]>) => {
      state.folders = action.payload
    },
    loadAllBookmark: (state, action: PayloadAction<ArkBookmark[]>) => {
      state.bookmarks = action.payload
    },
    _deleteBookmarks: (state, action: PayloadAction<string[]>) => {
      state.bookmarks = state.bookmarks.filter(
        (t) => !action.payload.includes(t._id!)
      )
      AsyncStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
    },
    _deleteCollection: (state, action: PayloadAction<string>) => {
      state.folders = state.folders.filter((t) => action.payload !== t._id!)
      AsyncStorage.setItem('folders', JSON.stringify(state.folders))
    },
    _updateCollection: (state, action: PayloadAction<ArkFolder>) => {
      state.folders = state.folders.map((t) => {
        if (action.payload._id === t._id!) {
          return action.payload
        }
        return t
      })
      AsyncStorage.setItem('folders', JSON.stringify(state.folders))
    },
    _updateBookmarks: (state, action: PayloadAction<ArkBookmark>) => {
      state.bookmarks = state.bookmarks.map((t) => {
        if (action.payload._id === t._id!) {
          return action.payload
        }
        return t
      })
      AsyncStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
    },
    _updateLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    // builder
    //   .addCase(incrementAsync.pending, (state) => {
    //     state.status = 'loading'
    //   })
    //   .addCase(incrementAsync.fulfilled, (state, action) => {
    //     state.status = 'idle'
    //     state.value += action.payload
    //   })
  },
})

export const {
  _createCollection,
  _createBookmark,
  newIdentity,
  newThreadId,
  loadAllCollection,
  loadAllBookmark,
  _deleteBookmarks,
  _deleteCollection,
  _updateCollection,
  _updateBookmarks,
  _updateLoading,
} = accountSlice.actions

export const selectFolders = (state: RootState) => state.account.folders

export const selectCollectionById = (id: string) => (state: RootState) =>
  state.account.folders.find((t) => t._id === id)

export const selectBookmarks = (state: RootState) => state.account.bookmarks

export const selectIdentity = (state: RootState) => state.account.identity

export const selectThreadId = (state: RootState) => state.account.threadId

export const selectLoading = (state: RootState) => state.account.loading

export default accountSlice.reducer
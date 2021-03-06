export enum HistoryEvent {
    createUser = 'create user',
    confirmAccount = 'confirm account',
    authUser = 'auth user',
    logoutUser = 'logout user',
    refreshToken = 'refresh token',
    blockUser = 'block user',
    unlockUser = 'unlock user',
    addGame = 'add game',
    changePassword = 'change password',
    sendResetPasswordMail = 'send reset password mail',
    resetPassword = 'reset password',
    updateUserProfile = 'update user profile',
    editGame = 'edit game',
    deleteGame = 'delete game',
    addGameCredentials = 'add game credentials',
    editGameCredentials = 'edit game credentials',
    deleteGameCredentials = 'delete game credentials',
    addGameComment = 'add game comment',
    editGameComment = 'edit game comment',
    createOrder = 'create order',
    acceptOrder = 'accept order',
    rejectOrder = 'reject order',
}

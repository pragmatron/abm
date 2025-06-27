    const usersTable = $getGrid('users')

    const userId = this.fbUser.uid;

    const matchingUser = usersTable.find(user => user.rowKey === userId);


    const result = matchingUser.role === '-NdaGVbsLKcbro6cIpgm';
    return result;


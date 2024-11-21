const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const deleteUnverifiedUsers = onSchedule("every 24 hours", async () => {
  const auth = admin.auth();
  const now = Date.now();
  const sevenDaysInMillis = 24 * 60 * 60 * 1000;

  try {
    let nextPageToken;
    do {
      const listUsersResult = await auth.listUsers(1000, nextPageToken);

      listUsersResult.users.forEach(async (user) => {
        if (!user.emailVerified) {
          const creationTime = new Date(user.metadata.creationTime).getTime();
          if (now - creationTime > sevenDaysInMillis) {
            await auth.deleteUser(user.uid);
            console.log(`Usuario ${user.email} eliminado.`);
          }
        }
      });

      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    console.log("Eliminación de usuarios no verificados completada.");
  } catch (error) {
    console.error("Error al eliminar usuarios:", error);
  }
});

module.exports = deleteUnverifiedUsers;

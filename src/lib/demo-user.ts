/**
 * There is no real authentication in V1 (Constitution §4), so there is
 * no logged-in session to read an actor id from. Interactions logged
 * via "Add interaction" are attributed to the workspace owner, the
 * same fixed demo identity used wherever the app needs a "you" (Maya
 * Chen, usr_maya) — never a second ad hoc user id.
 */
export const DEMO_CURRENT_USER_ID = "usr_maya";

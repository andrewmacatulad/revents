import { toastr } from "react-redux-toastr";

export const followUser = follower => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    try {
      await firestore.set(
        {
          collection: "users",
          doc: user.uid,
          subcollections: [{ collection: "following", doc: follower.id }]
        },
        {
          displayName: follower.displayName,
          photoURL: follower.photoURL || "/assets/user.png",
          city: follower.city || "Unknown City"
        }
      );
      toastr.success("Success", "Event has been created");
    } catch (error) {
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const unfollowUser = following => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  try {
    //   await firestore.update(`events/${following.id}`, {
    //     [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    //   });
    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "following", doc: following.id }]
    });
    toastr.success("Success", `You have unfollow ${following.displayName}`);
  } catch (error) {
    console.log(error);
    toastr.error("Opps", "Something went wrong");
  }
};

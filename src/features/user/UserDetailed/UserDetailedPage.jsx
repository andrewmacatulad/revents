import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import { Grid } from "semantic-ui-react";
import { toastr } from "react-redux-toastr";

import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedSidebar from "./UserDetailedSidebar";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedEvents from "./UserDetailedEvents";

import { userDetailedQuery } from "../userQueries";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { getUserEvents } from "../userActions";
import { followUser, unfollowUser } from "../peopleActions";

const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }
  return {
    profile,
    userUid,
    events: state.events,
    eventsLoading: state.async.loading,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
    following: state.firestore.ordered.following
  };
};

const actions = {
  getUserEvents,
  followUser,
  unfollowUser
};
class UserDetailedPage extends Component {
  async componentDidMount() {
    let user = await this.props.firestore.get(
      `users/${this.props.match.params.id}`
    );
    if (!user.exists) {
      toastr.error("Not Found", "User not Found");
      this.props.history.push("/error");
    }
    await this.props.getUserEvents(this.props.userUid);

    // console.log(events);
  }
  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  };
  render() {
    const {
      profile,
      photos,
      auth,
      match,
      requesting,
      eventsLoading,
      events,
      followUser,
      unfollowUser,
      following
    } = this.props;
    const isCurrentUser = auth.uid === match.params.id;
    const loading = requesting[`users/${match.params.id}`];
    const isFollowing = !isEmpty(following);
    if (loading) {
      return <LoadingComponent inverted={true} />;
    }
    console.log(isFollowing);
    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar
          unfollowUser={unfollowUser}
          isFollowing={isFollowing}
          isCurrentUser={isCurrentUser}
          profile={profile}
          followUser={followUser}
        />
        {photos && photos.length > 0 && <UserDetailedPhotos photos={photos} />}
        <UserDetailedEvents
          eventsLoading={eventsLoading}
          events={events}
          changeTab={this.changeTab}
        />
      </Grid>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  firestoreConnect((auth, userUid, match) => userDetailedQuery(auth, userUid))(
    UserDetailedPage
  )
);

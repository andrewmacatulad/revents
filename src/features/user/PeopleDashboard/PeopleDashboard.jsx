import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Grid, Segment, Header, Card } from "semantic-ui-react";

import PersonCard from "./PersonCard";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "following" }],
      storeAs: "following"
    },
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "followers" }],
      storeAs: "followers"
    }
  ];
};

const mapState = state => {
  return {
    auth: state.firebase.auth,
    following: state.firestore.ordered.following,
    followers: state.firestore.ordered.followers,
    requesting: state.firestore.status.requesting
  };
};
class PeopleDashboard extends Component {
  render() {
    const { following, requesting, followers } = this.props;
    const loading = Object.values(requesting).some(a => a === true);

    if (loading) {
      return <LoadingComponent inverted={true} />;
    }
    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Header dividing content="People following me" />
            <Card.Group itemsPerRow={8} stackable>
              {followers &&
                followers.map(follower => (
                  <PersonCard key={follower.id} follow={follower} />
                ))}
            </Card.Group>
          </Segment>
          <Segment>
            <Header dividing content="People I'm following" />
            <Card.Group itemsPerRow={8} stackable>
              {following &&
                following.map(follow => (
                  <PersonCard key={follow.id} follow={follow} />
                ))}
            </Card.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

// export default connect(
//   null
// )(PeopleDashboard);

export default compose(
  connect(mapState),
  firestoreConnect(auth => query(auth))
)(PeopleDashboard);

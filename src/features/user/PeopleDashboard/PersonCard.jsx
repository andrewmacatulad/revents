import React from "react";
import { Card, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

const PersonCard = ({ follow }) => {
  return (
    <Card as={Link} to={`/profile/${follow.id}`}>
      <Image src={follow.photoURL || "/assets/user.png"} />
      <Card.Content textAlign="center">
        <Card.Header content={follow.displayName} />
      </Card.Content>
      <Card.Meta textAlign="center">
        <span>{follow.city}</span>
      </Card.Meta>
    </Card>
  );
};

export default PersonCard;

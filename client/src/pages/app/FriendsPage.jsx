import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Textarea } from "@chakra-ui/react";
import { apiInstance } from "../../api/instance";
import { authStore } from "../../stores/auth-store";
import Friend from "../../components/utils/Friend";
import User from "../../components/utils/User";

export default function FriendsPage() {
  const navigate = useNavigate();
  const token = authStore((state) => state.token);

  const [friendName, setFriendName] = useState("");

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  const [isSearching, setIsSearching] = useState(false);

  async function searchFriend() {
    setIsSearching(true);
    let fName = friendName.toLowerCase().trim();
    if (!fName || fName.includes(" ")) {
      alert("Please enter a valid name");
      return;
    }
    try {
      const response = await apiInstance.get(`/friends/${friendName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let u = response.data.map((user) => {
        return {
          fullName: user.firstName + " " + user.lastName,
          _id: user._id,
        };
      });
      setSearchedUsers(u);
      if (u.length == 0) {
        alert("No users found with that first name");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  }

  async function loadFriends() {
    try {
      const response = await apiInstance.get("/friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const f = response.data.map((friend) => {
        return {
          fullName: friend.firstName + " " + friend.lastName,
          _id: friend._id,
        };
      });
      setFriends(f);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div className="friends-page">
      <section className="form">
        <h1>Search users (please use full or partial first name)</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchFriend();
          }}
        >
          <Input
            type="search"
            required
            onChange={(e) => {
              setFriendName(e.target.value);
            }}
          />

          <Button colorScheme="green" type="submit" isLoading={isSearching}>
            search
          </Button>
        </form>
        {searchedUsers.length > 0 && (
          <div className="searched-users">
            {searchedUsers.map((user) => {
              return <User key={user._id} {...user} />;
            })}
          </div>
        )}
      </section>
      {friends.length > 0 ? (
        <section className="current-friends">
          {friends.map((friend) => (
            <Friend {...friend} key={friend._id} />
          ))}
        </section>
      ) : (
        <section className="no-friends">
          <p>You have no friends yet. Search for friends above.</p>
        </section>
      )}
    </div>
  );
}

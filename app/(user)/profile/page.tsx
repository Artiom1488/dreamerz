"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/api/requests";
import { User } from "@/api/request-types";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="space-y-2">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>First Name:</strong> {user.firstName || "N/A"}
        </p>
        <p>
          <strong>Last Name:</strong> {user.lastName || "N/A"}
        </p>
        <p>
          <strong>Balance:</strong> {user.balance}
        </p>
        <p>
          <strong>Birthday:</strong> {user.birthday || "N/A"}
        </p>
        <p>
          <strong>City:</strong> {user.city || "N/A"}
        </p>
        <p>
          <strong>Country:</strong> {user.country || "N/A"}
        </p>
        <p>
          <strong>Description:</strong> {user.description || "N/A"}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender || "N/A"}
        </p>
        <p>
          <strong>Phone Number:</strong> {user.phoneNumber || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Email Confirmed:</strong>{" "}
          {user.isEmailConfirmed ? "Yes" : "No"}
        </p>
        <p>
          <strong>Onboarding Status:</strong> {user.onboardingStatus || "N/A"}
        </p>
        <p>
          <strong>Monthly Subscription Status:</strong>{" "}
          {user.monthlySubscriptionStatus || "N/A"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(user.updatedAt).toLocaleString()}
        </p>
        <p>
          <strong>Cover Image:</strong> {user.coverImage || "N/A"}
        </p>
        <p>
          <strong>Main Image URL:</strong> {user.mainImageUrl || "N/A"}
        </p>
        <p>
          <strong>Images:</strong>{" "}
          {user.images.length > 0 ? user.images.join(", ") : "None"}
        </p>
        <p>
          <strong>Stripe Customer ID:</strong> {user.stripeCustomerId || "N/A"}
        </p>
        <p>
          <strong>Stripe Product ID:</strong> {user.stripeProductId || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;

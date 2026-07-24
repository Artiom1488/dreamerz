import { useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  getUser,
  getUserById,
  getUserDreams,
  getUserDreamsByUserId,
  getAllDreams,
  updateUser,
  CreateDream,
  updateDream,
  likeDream,
  UploadCoverImage,
  DeleteCoverImage,
  UpdateCoverImagePosition,
  UploadImages,
  DeleteDreamImage,
  UploadUserImages,
  DeleteUserImage,
  getAllCharities,
  getCharityById,
  getNewsFeeds,
  searchUsers,
  getMyActivity,
  getUserActivityByUserId,
  getDreamComments,
  CreateComment,
  getLastDonations,
} from "./requests";
import type {
  User,
  DreamDto,
  PaginatedResponse,
  UpdateProfilePayload,
  CreateDreamDto,
  UpdateDreamDto,
  GetUserDreamsParams,
  GetUserDreamsByUserIdParams,
  GetAllDreamsParams,
  UploadImagePayload,
  UploadImagesPayload,
  UploadUserImagesPayload,
  GetNewsFeedsParams,
  SearchUsersParams,
  GetMyActivityParams,
  GetUserActivityParams,
  GetDreamCommentsParams,
  CreateCommentDto,
  CommentDto,
} from "./request-types";

// Queries

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getUser();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await getUserById(userId);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// Debounces the `name` query so callers can bind this straight to an
// input's onChange without managing their own timer. Only fires once
// `name` is non-empty (after debounce); pass email/birthDay undebounced
// via extraParams if you need them applied immediately.
export const useSearchUsers = (
  name: string,
  extraParams?: Omit<SearchUsersParams, "name">,
  debounceMs = 300,
) => {
  const [debouncedName, setDebouncedName] = useState(name);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedName(name), debounceMs);
    return () => clearTimeout(handle);
  }, [name, debounceMs]);

  return useQuery({
    queryKey: ["users", "search", debouncedName, extraParams],
    queryFn: async () => {
      const response = await searchUsers({
        name: debouncedName,
        ...extraParams,
      });
      return response.data;
    },
    enabled: debouncedName.trim().length > 0,
    staleTime: 60 * 1000,
  });
};

export const useUserDreams = (params?: GetUserDreamsParams) => {
  return useQuery({
    queryKey: ["dreams", params],
    queryFn: async () => {
      const response = await getUserDreams(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for dreams
  });
};

export const useUserDreamsByUserId = (
  userId: string,
  params?: GetUserDreamsByUserIdParams,
) => {
  return useQuery({
    queryKey: ["dreams", "user", userId, params],
    queryFn: async () => {
      const response = await getUserDreamsByUserId(userId, params);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes for dreams
  });
};

// All dreams across all users, for the dashboard page. Pass
// { isPopular: true } to fetch only popular dreams instead of the full list.
export const useAllDreams = (params?: GetAllDreamsParams) => {
  return useQuery({
    queryKey: ["dreams", "all", params],
    queryFn: async () => {
      const response = await getAllDreams(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for dreams
  });
};

export const useDreamComments = (
  dreamId: string,
  params?: GetDreamCommentsParams,
) => {
  return useQuery({
    queryKey: ["comments", dreamId, params],
    queryFn: async () => {
      const response = await getDreamComments(dreamId, params);
      return response.data;
    },
    enabled: !!dreamId,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useMyActivity = (params?: GetMyActivityParams) => {
  return useQuery({
    queryKey: ["activity", "my", params],
    queryFn: async () => {
      const response = await getMyActivity(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserActivityByUserId = (
  userId: string,
  params: GetUserActivityParams,
) => {
  return useQuery({
    queryKey: ["activity", "user", userId, params],
    queryFn: async () => {
      const response = await getUserActivityByUserId(userId, params);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCharities = () => {
  return useQuery({
    queryKey: ["charities"],
    queryFn: async () => {
      const response = await getAllCharities();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCharityById = (charityId: string) => {
  return useQuery({
    queryKey: ["charity", charityId],
    queryFn: async () => {
      const response = await getCharityById(charityId);
      return response.data;
    },
    enabled: !!charityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Infinite-scroll news feed ("doomscroll"). take defaults to 10 server-side;
// pass a larger take if you want fewer round trips per scroll.
export const useNewsFeeds = (params?: Omit<GetNewsFeedsParams, "page">) => {
  return useInfiniteQuery({
    queryKey: ["newsFeeds", params],
    queryFn: async ({ pageParam }) => {
      const response = await getNewsFeeds({ ...params, page: pageParam });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 60 * 1000, // 1 minute — feed content changes often
  });
};

// Last 25 donations across all dreams, newest first — e.g. for a "recent
// donors" widget. Note: each entry only has the donor's `userId`, not a
// full user summary, so pair with useUserById if you need their name/avatar.
export const useLastDonations = () => {
  return useQuery({
    queryKey: ["donations", "last"],
    queryFn: async () => {
      const response = await getLastDonations();
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute — recent donations change often
  });
};

// Mutations

export const useUpdateUser = (
  options?: Omit<
    UseMutationOptions<User, Error, Partial<UpdateProfilePayload>>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await updateUser(payload);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the user cache with the new data
      queryClient.setQueryData(["user"], data);
      // Invalidate user queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    ...options,
  });
};

export const useCreateDream = (
  options?: Omit<
    UseMutationOptions<DreamDto, Error, CreateDreamDto>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await CreateDream(payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate dreams queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["dreams"] });
    },
    ...options,
  });
};

export const useUpdateDream = (
  options?: Omit<
    UseMutationOptions<
      DreamDto,
      Error,
      { dreamId: string; payload: Partial<UpdateDreamDto> }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ dreamId, payload }) => {
      const response = await updateDream(dreamId, payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate dreams queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["dreams"] });
    },
    ...options,
  });
};

// Toggles like state for a dream. The endpoint returns the full updated
// DreamDto, so we splice it directly into any cached "dreams" list/detail
// queries instead of just invalidating (avoids a refetch flash on tap).
export const useLikeDream = (
  options?: Omit<UseMutationOptions<DreamDto, Error, string>, "mutationFn">,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dreamId) => {
      const response = await likeDream(dreamId);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueriesData<PaginatedResponse<DreamDto>>(
        { queryKey: ["dreams"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map((dream) =>
              dream.id === data.id ? { ...dream, ...data } : dream,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["dreams"] });
    },
    ...options,
  });
};

export const useCreateComment = (
  options?: Omit<
    UseMutationOptions<CommentDto, Error, CreateCommentDto>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await CreateComment(payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate this dream's comments so the new comment/reply appears
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.dreamId],
      });
    },
    ...options,
  });
};

export const useUploadCoverImage = (
  options?: Omit<UseMutationOptions<void, Error, File>, "mutationFn">,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file) => {
      await UploadCoverImage(file);
    },
    onSuccess: async () => {
      // Refetch user data to get updated cover image
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    ...options,
  });
};

export const useDeleteCoverImage = (
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageId) => {
      await DeleteCoverImage(imageId);
    },
    onSuccess: async () => {
      // Refetch user data to remove cover image
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    ...options,
  });
};

export const useUpdateCoverImagePosition = (
  options?: Omit<
    UseMutationOptions<void, Error, { imageId: string; position: number }>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId, position }) => {
      await UpdateCoverImagePosition(imageId, position);
    },
    onSuccess: async () => {
      // Refetch user data to get updated position
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    ...options,
  });
};

export const useUploadDreamImages = (
  options?: Omit<
    UseMutationOptions<void, Error, UploadImagesPayload>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      await UploadImages(payload);
    },
    onSuccess: async () => {
      // Invalidate dreams queries to refresh with new images
      await queryClient.invalidateQueries({ queryKey: ["dreams"] });
    },
    ...options,
  });
};

export const useDeleteDreamImage = (
  options?: Omit<
    UseMutationOptions<void, Error, { dreamId: string; imageId: string }>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ dreamId, imageId }) => {
      await DeleteDreamImage(dreamId, imageId);
    },
    onSuccess: async () => {
      // Invalidate dreams queries to refresh with deleted image removed
      await queryClient.invalidateQueries({ queryKey: ["dreams"] });
    },
    ...options,
  });
};

export const useUploadUserImages = (
  options?: Omit<
    UseMutationOptions<void, Error, UploadUserImagesPayload>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      await UploadUserImages(payload);
    },
    onSuccess: async () => {
      // Refetch user data to get updated images
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    ...options,
  });
};

export const useDeleteUserImage = (
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageId) => {
      await DeleteUserImage(imageId);
    },
    onSuccess: async () => {
      // Refetch user data to get updated images
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    ...options,
  });
};
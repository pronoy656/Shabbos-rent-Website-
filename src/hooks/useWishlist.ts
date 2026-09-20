import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyWishlist, toggleWishlist } from "@/services/wishlist.service";
import type { WishlistResponse, ToggleWishlistResponse } from "@/types/wishlist.types";

export const WISHLIST_QUERY_KEY = ["my-wishlist"];

/** Hook to fetch current user's wishlist */
export const useMyWishlist = () => {
  const isAuth =
    typeof window !== "undefined" &&
    Boolean(
      localStorage.getItem("auth_token") || localStorage.getItem("accessToken")
    );

  return useQuery<WishlistResponse>({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: getMyWishlist,
    enabled: isAuth,
    staleTime: 5 * 60 * 1000,
  });
};

/** Hook to toggle apartment in wishlist */
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleWishlistResponse, Error, string>({
    mutationFn: (apartmentId: string) => toggleWishlist({ apartmentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
};

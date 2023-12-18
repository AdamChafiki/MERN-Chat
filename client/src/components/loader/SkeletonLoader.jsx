import { Stack, Skeleton, Box } from "@chakra-ui/react";
export default function SkeletonLoader() {
  return (
    <Stack mt={5}>
      <Skeleton height="40px"></Skeleton>
      <Skeleton height="40px"></Skeleton>
      <Skeleton height="40px"></Skeleton>
      <Skeleton height="40px"></Skeleton>
    </Stack>
  );
}

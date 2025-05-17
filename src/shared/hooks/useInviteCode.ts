import { useRouter } from 'next/router';

export function useInviteCode() {
  const router = useRouter();
  const inviteCode = router.query.inviteCode as string | undefined;

  return {
    inviteCode,
    hasInviteCode: !!inviteCode,
  };
}

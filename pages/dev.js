import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DevRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Use replace so history isn't polluted
    router.replace('/list?dev=1');
  }, [router]);
  return null;
}

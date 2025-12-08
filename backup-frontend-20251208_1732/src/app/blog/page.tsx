import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect permanently to canonical blogs listing
  redirect('/blogs');
}

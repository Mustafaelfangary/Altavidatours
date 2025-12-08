'use client';

import dynamic from 'next/dynamic';
const AutoTranslateClient = dynamic(
  () => import('./AutoTranslate'),
  { 
    ssr: false,
    loading: () => null
  }
);

type AutoTranslateWrapperProps = {
  [key: string]: any;
};

export default function AutoTranslateWrapper(props: AutoTranslateWrapperProps) {
  return <AutoTranslateClient {...props} />;
}

import { PageProps } from '@/services/data.d';

function Template(props: PageProps<any>) {
  const { children } = props;

  return children;
}

export default Template;

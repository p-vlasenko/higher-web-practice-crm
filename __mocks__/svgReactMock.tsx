import type { SVGProps } from 'react';

export default function SvgReactMock(props: SVGProps<SVGSVGElement>) {
  return <svg {...props} />;
}

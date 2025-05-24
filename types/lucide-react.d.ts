declare module "lucide-react" {
  import { FC, SVGProps } from "react";

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export const Search: FC<IconProps>;
  export const Share2: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const Code: FC<IconProps>;
  export const Star: FC<IconProps>;
  export const ExternalLink: FC<IconProps>;
  export const Github: FC<IconProps>;
  export const Filter: FC<IconProps>;
}

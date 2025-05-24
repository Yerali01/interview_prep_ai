import { ReactNode } from "react";
import { HTMLAttributes } from "react";

declare module "@/components/ui/card" {
  export interface CardProps extends HTMLAttributes<HTMLDivElement> {}
  export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
  export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
  export interface CardDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> {}
  export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

  export const Card: React.FC<CardProps>;
  export const CardHeader: React.FC<CardHeaderProps>;
  export const CardTitle: React.FC<CardTitleProps>;
  export const CardDescription: React.FC<CardDescriptionProps>;
  export const CardContent: React.FC<CardContentProps>;
}

declare module "@/components/ui/badge" {
  export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "destructive";
  }
  export const Badge: React.FC<BadgeProps>;
}

declare module "@/components/ui/button" {
  export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean;
  }
  export const Button: React.FC<ButtonProps>;
}

declare module "@/components/ui/input" {
  export interface InputProps extends HTMLAttributes<HTMLInputElement> {}
  export const Input: React.FC<InputProps>;
}

declare module "@/components/ui/skeleton" {
  export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}
  export const Skeleton: React.FC<SkeletonProps>;
}

declare module "@/components/ui/select" {
  export interface SelectProps extends HTMLAttributes<HTMLDivElement> {
    value?: string;
    onValueChange?: (value: string) => void;
  }
  export interface SelectTriggerProps
    extends HTMLAttributes<HTMLButtonElement> {}
  export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {}
  export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {}
  export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
  }

  export const Select: React.FC<SelectProps>;
  export const SelectTrigger: React.FC<SelectTriggerProps>;
  export const SelectValue: React.FC<SelectValueProps>;
  export const SelectContent: React.FC<SelectContentProps>;
  export const SelectItem: React.FC<SelectItemProps>;
}

declare module "@/components/ui/use-toast" {
  export interface Toast {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
  }

  export interface ToastContextValue {
    toast: (props: Toast) => void;
  }

  export const useToast: () => ToastContextValue;
}

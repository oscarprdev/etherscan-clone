import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '~/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const CnTooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 max-w-[40ch] overflow-hidden rounded-md bg-primary px-3 py-1.5 text-center text-xs text-primary-foreground text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Tooltip = ({
  content,
  side,
  children,
}: React.PropsWithChildren<{ content: string; side?: 'top' | 'right' | 'bottom' | 'left' }>) => {
  return (
    <TooltipProvider delayDuration={300}>
      <CnTooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent side={side || 'bottom'}>
          <p className="text-xs text-white">{content}</p>
        </TooltipContent>
      </CnTooltip>
    </TooltipProvider>
  );
};

const TooltipWithLabel = ({
  content,
  label,
  children,
}: React.PropsWithChildren<{ content: string; label: string }>) => {
  return (
    <label className="flex gap-1">
      <p className="font-medium text-stone-900">{label}</p>
      <TooltipProvider delayDuration={300}>
        <CnTooltip>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent>
            <p className="text-xs text-white">{content}</p>
          </TooltipContent>
        </CnTooltip>
      </TooltipProvider>
    </label>
  );
};

export { Tooltip, TooltipWithLabel, CnTooltip, TooltipTrigger, TooltipContent, TooltipProvider };

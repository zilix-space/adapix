import React from "react"
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "../../helpers/cn"

// Adicionando a variante de orientação
const timelineVariants = cva("grid", {
  variants: {
    orientation: {
      vertical: "grid-cols-1",
      horizontal: "grid-rows-1",
    },
    positions: {
      left: "[&>li]:grid-cols-[0_min-content_1fr]",
      right: "[&>li]:grid-cols-[1fr_min-content_0]",
      center: "[&>li]:grid-cols-[1fr_min-content_1fr]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    positions: "left",
  },
})

interface TimelineProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof timelineVariants> {
  orientation?: 'vertical' | 'horizontal';
}

const Timeline = React.forwardRef<HTMLUListElement, TimelineProps>(
  ({ children, className, positions, orientation = "vertical", ...props }, ref) => {
    return (
      <ul
        className={cn(timelineVariants({ positions, orientation }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </ul>
    )
  }
)
Timeline.displayName = "Timeline"

const timelineItemVariants = cva("grid items-center gap-x-2", {
  variants: {
    status: {
      done: "text-primary",
      default: "text-muted-foreground",
    },
  },
  defaultVariants: {
    status: "default",
  },
})

interface TimelineItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof timelineItemVariants> {}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, status, ...props }, ref) => (
    <li
      className={cn(timelineItemVariants({ status }), className)}
      ref={ref}
      {...props}
    />
  )
)
TimelineItem.displayName = "TimelineItem"

const timelineDotVariants = cva(
  "flex items-center justify-center rounded-full border border-current",
  {
    variants: {
      orientation: {
        vertical: "col-start-2 col-end-3 row-start-1 row-end-1 size-4",
        horizontal: "row-start-2 row-end-3 col-start-1 col-end-1 size-4",
      },
      status: {
        default: "[&>*]:hidden",
        current:
          "[&>*:not(.radix-circle)]:hidden [&>.radix-circle]:bg-current [&>.radix-circle]:fill-current",
        done: "bg-primary [&>*:not(.radix-check)]:hidden [&>.radix-check]:text-background",
        error:
          "border-destructive bg-destructive [&>*:not(.radix-cross)]:hidden [&>.radix-cross]:text-background",
        custom: "[&>*:not(:nth-child(4))]:hidden [&>*:nth-child(4)]:block",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      status: "default",
    },
  }
)

interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {
  customIcon?: React.ReactNode
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, status, customIcon, orientation = "vertical", ...props }, ref) => (
    <div
      role="status"
      className={cn("timeline-dot", timelineDotVariants({ status, orientation }), className)}
      ref={ref}
      {...props}
    >
      <div className="radix-circle size-2.5 rounded-full" />
      <CheckIcon className="radix-check size-3" />
      <Cross1Icon className="radix-cross size-2.5" />
      {customIcon}
    </div>
  )
)
TimelineDot.displayName = "TimelineDot"

const timelineContentVariants = cva(
  "pb-8 text-muted-foreground",
  {
    variants: {
      orientation: {
        vertical: "row-start-2 row-end-2",
        horizontal: "col-start-2 col-end-2",
      },
      side: {
        right: "mr-auto text-left",
        left: "ml-auto text-right",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      side: "right",
    },
  }
)

interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineContentVariants> {
  orientation?: 'vertical' | 'horizontal';
}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, side, orientation = "vertical", ...props }, ref) => (
    <div
      className={cn(timelineContentVariants({ side, orientation }), className)}
      ref={ref}
      {...props}
    />
  )
)
TimelineContent.displayName = "TimelineContent"

const timelineHeadingVariants = cva(
  "line-clamp-1 max-w-full truncate",
  {
    variants: {
      orientation: {
        vertical: "row-start-1 row-end-1",
        horizontal: "col-start-1 col-end-1",
      },
      side: {
        right: "col-start-3 col-end-4 mr-auto text-left",
        left: "col-start-1 col-end-2 ml-auto text-right",
      },
      variant: {
        primary: "text-base font-medium text-primary",
        secondary: "text-sm font-light text-muted-foreground",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      side: "right",
      variant: "primary",
    },
  }
)

interface TimelineHeadingProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof timelineHeadingVariants> {
  orientation?: 'vertical' | 'horizontal';
}

const TimelineHeading = React.forwardRef<
  HTMLParagraphElement,
  TimelineHeadingProps
>(({ className, side, variant, orientation = "vertical", ...props }, ref) => (
  <p
    role="heading"
    aria-level={variant === "primary" ? 2 : 3}
    className={cn(timelineHeadingVariants({ side, variant, orientation }), className)}
    ref={ref}
    {...props}
  />
))
TimelineHeading.displayName = "TimelineHeading"

interface TimelineLineProps extends React.HTMLAttributes<HTMLHRElement> {
  done?: boolean
  orientation?: 'vertical' | 'horizontal';
}

const TimelineLine = React.forwardRef<HTMLHRElement, TimelineLineProps>(
  ({ className, done = false, orientation = "vertical", ...props }, ref) => {
    return (
      <hr
        role="separator"
        aria-orientation={orientation === "vertical" ? "vertical" : "horizontal"}
        className={cn(
          orientation === "vertical" ? "col-start-2 col-end-3 row-start-2 row-end-2 mx-auto flex h-full min-h-16 w-0.5 justify-center rounded-full" :
          "row-start-2 row-end-3 col-start-2 col-end-2 mx-auto flex w-full min-w-16 h-0.5 justify-center rounded-full",
          done ? "bg-primary" : "bg-muted",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TimelineLine.displayName = "TimelineLine"

export {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineHeading,
  TimelineLine,
}
'use client'

import { Loader2Icon } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { Button } from './button';
import { ArrowLeftIcon, ChevronLeftIcon } from '@radix-ui/react-icons';
import { cn } from '../../helpers/cn';

export const WidgetStepper = (props: PropsWithChildren) => {
  return (
    <section className="grid grid-rows-[auto_1fr_auto] h-full space-y-12">
      {props.children}
    </section>
  );
};

export const WidgetStepperHeader = (props: PropsWithChildren<{
  className?: string;
  hasBackButton?: boolean;
}>) => {
  const handleBackButtonClick = () => {
    history.back()
  }

  return (
    <header className={cn("animate-fade-up animate-delay-300 animate-once animate-ease-in-out text-center grid grid-rows-[auto_auto_auto] gap-3", props.className)}>
      {props.hasBackButton && (
        <Button type="button" variant="link" size="icon" className="h-10" onClick={handleBackButtonClick}>
          <ChevronLeftIcon className="w-4 h-4 mr-3" />
        </Button>
      )}
      <div className="flex flex-col items-center justify-center">
        {props.children}
      </div>
    </header>
  );
};

export const WidgetStepperHeaderStepCounter = (props: PropsWithChildren) => {
  return (
    <small className="font-bold uppercase opacity-40 text-lg">{props.children}</small>
  );
};

export const WidgetStepperHeaderTitle = (props: PropsWithChildren) => {
  return <h1 className="font-bold text-xl">{props.children}</h1>;
};

export const WidgetStepperHeaderDescription = (props: PropsWithChildren) => {
  return <p className="opacity-60 text-md">{props.children}</p>;
};

export const WidgetStepperBody = (props: PropsWithChildren) => {
  return (
    <main className="space-y-4 animate-fade-up animate-delay-500 animate-once animate-ease-in-out">
      {props.children}
    </main>
  );
};

export const WidgetStepperFooter = (
  props: PropsWithChildren<{
    className?: string;
  }>,
) => {
  return (
    <footer className="flex flex-col items-center space-x-2 animate-fade-up animate-delay-700 animate-once animate-ease-in-out">
      {props.children}
    </footer>
  );
};

export const WidgetStepperSubmitButton = (
  props: PropsWithChildren<{ isLoading: boolean; isDisabled?: boolean }>,
) => {
  return (
    <Button type="submit" className="w-full h-14 text-md" disabled={props.isLoading || props.isDisabled}>
      {props.children}
      {!props.isLoading}
      {props.isLoading && <Loader2Icon className="w-3 h-3 ml-2 animate-spin" />}
    </Button>
  );
};


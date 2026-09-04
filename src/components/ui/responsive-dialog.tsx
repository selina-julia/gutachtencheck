"use client";

import { createContext, use } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/** Ab dieser Breite wird der Dialog gezeigt, darunter der Drawer. */
const AB_DIALOG = "(min-width: 640px)";

const IstDialogKontext = createContext(false);

function ResponsiveDialog({
  children,
  ...props
}: React.ComponentProps<typeof Dialog>) {
  const istDialog = useMediaQuery(AB_DIALOG);
  const Root = istDialog ? Dialog : Drawer;

  return (
    <IstDialogKontext value={istDialog}>
      <Root {...props}>{children}</Root>
    </IstDialogKontext>
  );
}

function ResponsiveDialogTrigger(
  props: React.ComponentProps<typeof DialogTrigger>,
) {
  return use(IstDialogKontext) ? (
    <DialogTrigger {...props} />
  ) : (
    <DrawerTrigger {...props} />
  );
}

function ResponsiveDialogContent({
  className,
  drawerClassName,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof DialogContent> & {
  /** Zusätzliche Klassen, die nur für die Drawer-Variante gelten. */
  drawerClassName?: string;
}) {
  if (use(IstDialogKontext)) {
    return (
      <DialogContent
        className={className}
        showCloseButton={showCloseButton}
        {...props}
      />
    );
  }

  // Der Drawer kennt kein showCloseButton — dort schließt die Wischgeste.
  return (
    <DrawerContent
      className={cn(
        "gap-4 overflow-y-auto p-4 pt-0 [&>*]:shrink-0",
        "data-[vaul-drawer-direction=bottom]:max-h-[85dvh]",
        drawerClassName,
      )}
      {...props}
    />
  );
}

function ResponsiveDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return use(IstDialogKontext) ? (
    <DialogHeader className={className} {...props} />
  ) : (
    <DrawerHeader className={cn("p-0 text-left!", className)} {...props} />
  );
}

function ResponsiveDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return use(IstDialogKontext) ? (
    <DialogTitle className={className} {...props} />
  ) : (
    <DrawerTitle className={className} {...props} />
  );
}

function ResponsiveDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  return use(IstDialogKontext) ? (
    <DialogDescription className={className} {...props} />
  ) : (
    <DrawerDescription className={className} {...props} />
  );
}

function ResponsiveDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  return use(IstDialogKontext) ? (
    <DialogFooter className={className} {...props} />
  ) : (
    <DrawerFooter
      className={cn(
        "sticky bottom-0 -mx-4 border-t bg-background px-4 pt-4",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        className,
      )}
      {...props}
    />
  );
}

function ResponsiveDialogClose(
  props: React.ComponentProps<typeof DialogClose>,
) {
  return use(IstDialogKontext) ? (
    <DialogClose {...props} />
  ) : (
    <DrawerClose {...props} />
  );
}

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};

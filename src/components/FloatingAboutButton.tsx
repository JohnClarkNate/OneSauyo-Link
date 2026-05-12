import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const FloatingAboutButton = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/20 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <Globe className="h-6 w-6" />
        <span className="sr-only">About the website</span>
      </button>
    </DialogTrigger>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>About this website</DialogTitle>
        <DialogDescription>
          A barangay portal built to support residents, staff, and community members with digital services, local news, and event updates.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-2 text-sm text-muted-foreground">
        <div>
          <h3 className="font-semibold text-foreground">Purpose of the system</h3>
          <p className="mt-2">
            This website makes barangay information, announcements, calendars, and service access easier for the community.
            It helps streamline communication between residents and local government staff.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Key features</h3>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Announcements and news updates</li>
            <li>Community event calendar</li>
            <li>Official directory for barangay officials</li>
            <li>Service overview and request guidance</li>
            <li>Emergency hotlines and contact information</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Who will use this website</h3>
          <p className="mt-2">
            Residents, barangay staff, visitors, and community organizers can all use this portal for faster access to local services and information.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Development context</h3>
          <p className="mt-2">
            This is a student project and modernization effort to bring barangay services online in a modern, easy-to-use web application.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Future goals</h3>
          <p className="mt-2">
            Future improvements could include online request submission, record integration, mobile-friendly enhancements, and more automated community support features.
          </p>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default FloatingAboutButton;

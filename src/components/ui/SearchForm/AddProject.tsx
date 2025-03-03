import { Toaster } from "react-hot-toast";
import { Dialog, DialogContent } from "../dialog";
import AddProjectForm from "./AddProjectForm";

const AddProjectModal = ({ open, onOpenChange, onSearchSubmit }: any) => {
  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[80vw] sm:max-w-[500px] h-[90vh] lg:h-[95vh] overflow-y-auto scrollbar-custom">
          <h2 className="text-2xl font-bold tracking-tighter pb-6">
            Add Project
          </h2>
          <AddProjectForm
            onSearchSubmit={onSearchSubmit}
            onOpenChange={onOpenChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProjectModal;

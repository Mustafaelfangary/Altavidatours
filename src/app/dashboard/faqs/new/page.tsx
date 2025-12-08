import { FaqForm } from "@/components/admin/FaqForm";

const NewFaqPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FaqForm />
      </div>
    </div>
  );
};

export default NewFaqPage;
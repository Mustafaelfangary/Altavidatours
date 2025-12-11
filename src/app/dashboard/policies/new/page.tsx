import { PolicyForm } from "@/components/admin/PolicyForm";

const NewPolicyPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PolicyForm />
      </div>
    </div>
  );
};

export default NewPolicyPage;


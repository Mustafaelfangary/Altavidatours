import { PromotionForm } from "@/components/admin/PromotionForm";

const NewPromotionPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PromotionForm />
      </div>
    </div>
  );
};

export default NewPromotionPage;
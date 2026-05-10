import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  items: FAQItem[];
};

const faqData: FAQCategory[] = [
  {
    title: "OPAYS TECH vs Outils Publics (ex: ChatGPT)",
    items: [
      {
        question: "Pourquoi faire appel à OPAYS TECH alors que mes équipes utilisent déjà ChatGPT ?",
        answer: "ChatGPT est un excellent assistant généraliste, mais il n'est pas connecté à vos bases de données, ne connaît pas vos processus internes et ne peut pas automatiser vos flux de travail. Nos solutions s'intègrent directement au cœur de votre entreprise pour exécuter vos processus métiers de bout en bout, tout en garantissant la sécurité totale de vos données d'entreprise."
      },
      {
        question: "Vos solutions sont-elles plus compliquées à utiliser qu'un outil grand public ?",
        answer: "Non, au contraire. Nous concevons nos systèmes de \"l'infrastructure à l'usage\". Vos équipes n'ont pas besoin d'apprendre à \"prompter\" ou d'avoir des connaissances techniques. Les solutions que nous livrons s'intègrent naturellement dans leurs habitudes quotidiennes avec des interfaces intuitives."
      }
    ]
  },
  {
    title: "Implémentation & Intégration",
    items: [
      {
        question: "Dois-je changer tous mes logiciels actuels pour intégrer votre IA ?",
        answer: "Absolument pas. Nos solutions sont conçues pour s'interconnecter de manière transparente avec vos outils existants (ERP, CRM, messageries, bases de données). L'IA vient se brancher à votre infrastructure technologique actuelle sans perturber vos opérations."
      },
      {
        question: "Combien de temps faut-il pour déployer une solution IA chez nous ?",
        answer: "Cela dépend de la complexité de vos processus. Nous commençons toujours par identifier vos plus gros goulots d'étranglement pour déployer rapidement une première solution ciblée (souvent en quelques semaines), avant d'étendre progressivement l'automatisation à d'autres secteurs."
      }
    ]
  },
  {
    title: "Sécurité & Souveraineté",
    items: [
      {
        question: "Nos données d'entreprise vont-elles servir à entraîner d'autres IA publiques ?",
        answer: "Jamais. C'est la différence fondamentale avec les versions grand public. Nous privilégions des architectures souveraines. Vos données restent strictement confidentielles dans votre environnement sécurisé (cloud privé ou sur site) et n'en sortent sous aucun prétexte."
      }
    ]
  },
  {
    title: "Impact & Rentabilité",
    items: [
      {
        question: "Est-ce que l'IA va remplacer mes employés ?",
        answer: "Non. Notre objectif est de réduire la \"fatigue opérationnelle\" de vos collaborateurs. Nous automatisons les tâches répétitives, fastidieuses et sans valeur ajoutée, pour que vos équipes puissent se concentrer sur l'analyse, la relation client et la prise de décision stratégique."
      },
      {
        question: "Comment mesure-t-on le retour sur investissement (ROI) ?",
        answer: "Le ROI est très concret : il se mesure par le temps gagné par vos équipes, la diminution drastique des erreurs manuelles et l'accélération de vos délais de traitement. L'amélioration de la performance est généralement mesurable dès le premier mois d'utilisation."
      }
    ]
  }
];

function FAQAccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm overflow-hidden transition-all hover:border-white/20">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <h4 className="text-lg font-medium text-foreground pr-8">{item.question}</h4>
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-muted-foreground transition-colors hover:text-white">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (categoryId: number, itemIndex: number) => {
    const id = `${categoryId}-${itemIndex}`;
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--neon-cyan)]/5 blur-[120px] rounded-full -z-10" />

      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Questions <span className="text-gradient">Fréquentes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur l'intégration de l'IA au cœur de votre entreprise avec OPAYS TECH.
          </p>
        </div>

        <div className="space-y-12">
          {faqData.map((category, catIndex) => (
            <div key={catIndex} className="space-y-6">
              <h3 className="text-xl font-semibold text-[var(--neon-cyan)] border-b border-white/10 pb-2">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <FAQAccordionItem
                    key={itemIndex}
                    item={item}
                    isOpen={openIndex === `${catIndex}-${itemIndex}`}
                    onClick={() => toggleAccordion(catIndex, itemIndex)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

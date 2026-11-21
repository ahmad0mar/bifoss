import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TodoText } from '@/components/Todo'

export default function FAQ({ items }) {
  return (
    <Accordion type="single" collapsible className="w-full divide-y divide-brand-rule">
      {items.map((item, i) => (
        <AccordionItem
          key={item.q}
          value={`faq-${i}`}
          className="border-0 transition-colors duration-200 data-[state=open]:bg-brand-wash data-[state=open]:pl-3 data-[state=open]:border-l-2 data-[state=open]:border-l-brand-orange-fill rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="py-5 text-base font-semibold text-brand-ink transition-colors hover:text-brand-orange-ink hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-base text-brand-muted">
            <TodoText>{item.a}</TodoText>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

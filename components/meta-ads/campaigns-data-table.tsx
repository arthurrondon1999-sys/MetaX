"use client"

import { motion } from "framer-motion"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { InfoIcon } from "@/components/shared/info-icon"
import { Skeleton } from "@/components/shared/skeleton"
import { cn } from "@/lib/utils"
import { COLUMN_MAP, type Cell, type MoneyFn } from "@/lib/meta/columns"
import { statusLabel, type CampaignMetrics } from "@/lib/meta/metrics"

interface CampaignsDataTableProps {
  metrics: CampaignMetrics[]
  /** ordem completa das colunas (inclui ocultas) */
  order: string[]
  /** ids das colunas visíveis, já na ordem correta */
  visibleOrdered: string[]
  money: MoneyFn
  loading?: boolean
  flash?: boolean
  totalCell: (id: string) => Cell
  onReorder: (next: string[]) => void
}

function SortableHeader({ id, label, info }: { id: string; label: string; info?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  }
  return (
    <th
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/header px-4 py-3 text-left text-xs font-semibold text-[#E5E7EB] whitespace-nowrap select-none bg-white/[0.02]",
        isDragging && "bg-electric-blue/10",
      )}
    >
      <span className="inline-flex items-center gap-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-transparent group-hover/header:text-[#94A3B8] transition-colors"
          aria-label={`Reordenar coluna ${label}`}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        {label}
        {info && <InfoIcon />}
      </span>
    </th>
  )
}

export function CampaignsDataTable({
  metrics,
  order,
  visibleOrdered,
  money,
  loading = false,
  flash = false,
  totalCell,
  onReorder,
}: CampaignsDataTableProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = visibleOrdered.indexOf(String(active.id))
    const newIndex = visibleOrdered.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return
    const newVisible = arrayMove(visibleOrdered, oldIndex, newIndex)
    // Recompõe a ordem completa: colunas visíveis reordenadas + ocultas ao final
    const hidden = order.filter((id) => !visibleOrdered.includes(id))
    onReorder([...newVisible, ...hidden])
  }

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left w-10 bg-white/[0.02]">
                  <input type="checkbox" className="accent-electric-blue" />
                </th>
                <SortableContext items={visibleOrdered} strategy={horizontalListSortingStrategy}>
                  {visibleOrdered.map((id) => {
                    const def = COLUMN_MAP[id]
                    if (!def) return null
                    return <SortableHeader key={id} id={id} label={def.label} info={def.info} />
                  })}
                </SortableContext>
              </tr>
            </thead>
            <tbody>
              {/* Linha de totais */}
              {!loading && metrics.length > 0 && (
                <tr className="border-b border-white/10 font-semibold bg-white/[0.02]">
                  <td className="px-4 py-3" />
                  {visibleOrdered.map((id) => {
                    const cell = totalCell(id)
                    return (
                      <td key={id} className={cn("px-4 py-3 whitespace-nowrap", cell.color)}>
                        {cell.value}
                      </td>
                    )
                  })}
                </tr>
              )}

              {/* Skeleton */}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-4" />
                    </td>
                    {visibleOrdered.map((id) => (
                      <td key={id} className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))}

              {/* Campanhas */}
              {!loading &&
                metrics.map((m) => (
                  <motion.tr
                    key={m.id}
                    className={cn(
                      "border-b border-white/5 hover:bg-white/[0.02] transition-colors",
                      flash && "animate-data-flash",
                    )}
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" className="accent-electric-blue" />
                    </td>
                    {visibleOrdered.map((id) => {
                      const def = COLUMN_MAP[id]
                      if (!def) return null

                      if (def.special === "status") {
                        const active = m.status === "ACTIVE"
                        return (
                          <td key={id} className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                                active ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-[#94A3B8]"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-[#94A3B8]"}`} />
                              {statusLabel(m.status)}
                            </span>
                          </td>
                        )
                      }
                      if (def.special === "name") {
                        return (
                          <td key={id} className="px-4 py-3 text-white max-w-[260px] truncate" title={m.name}>
                            {m.name}
                          </td>
                        )
                      }
                      const cell = def.cell ? def.cell(m, money) : { value: "N/A", color: "text-[#94A3B8]" }
                      return (
                        <td key={id} className={cn("px-4 py-3 whitespace-nowrap", cell.color)}>
                          {cell.value}
                        </td>
                      )
                    })}
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </DndContext>
      </div>
    </div>
  )
}

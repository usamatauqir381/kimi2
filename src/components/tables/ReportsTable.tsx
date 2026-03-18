import { useState } from 'react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { TNDMonthlyReport } from '@/types';
import { cn } from '@/lib/utils';

interface ReportsTableProps {
  data: TNDMonthlyReport[];
  onView: (report: TNDMonthlyReport) => void;
  onEdit: (report: TNDMonthlyReport) => void;
  onDelete: (report: TNDMonthlyReport) => void;
  className?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    draft: 'bg-amber-100 text-amber-700 border-amber-200',
    submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles] || styles.draft)}>
      {status}
    </Badge>
  );
};

export function ReportsTable({ data, onView, onEdit, onDelete, className }: ReportsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<TNDMonthlyReport>[] = [
    {
      accessorKey: 'month',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Month
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.month} {row.original.year}
        </div>
      ),
    },
    {
      accessorKey: 'submitted_by',
      header: 'Submitted By',
      cell: ({ row }) => <div className="text-sm">{row.original.submitted_by}</div>,
    },
    {
      accessorKey: 'submitted_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Date
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.submitted_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: 'onboarding.new_teachers_onboarded',
      header: 'New Teachers',
      cell: ({ row }) => (
        <div className="text-sm">{row.original.onboarding?.new_teachers_onboarded || 0}</div>
      ),
    },
    {
      accessorKey: 'trial_classes.trial_pass_rate',
      header: 'Trial Pass Rate',
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {row.original.trial_classes?.trial_pass_rate || 0}%
        </div>
      ),
    },
    {
      accessorKey: 'ongoing_training.training_hours',
      header: 'Training Hours',
      cell: ({ row }) => (
        <div className="text-sm">{row.original.ongoing_training?.training_hours || 0}</div>
      ),
    },
    {
      accessorKey: 'parent_feedback.complaints_received',
      header: 'Complaints',
      cell: ({ row }) => (
        <div className="text-sm">{row.original.parent_feedback?.complaints_received || 0}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(row.original)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Monthly Reports</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {data.length} reports
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

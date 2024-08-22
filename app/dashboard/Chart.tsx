'use client';

import { CheckCircle, Circle } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { useMemo } from 'react';
import { TasksType } from '@/lib/get_tasks';

type ChartData = {
	status: 'done' | 'remaining';
	tasks: number;
	fill: string;
};

const chartConfig = {
	tasks: {
		label: 'Tasks'
	},
	done: {
		label: 'Done',
		color: 'hsl(var(--chart-1))'
	},
	remaining: {
		label: 'Remaining',
		color: 'hsl(var(--chart-2))'
	}
} satisfies ChartConfig;

export function Chart({ tasks }: { tasks: TasksType }) {
	let chartData: ChartData[] = [
		{
			status: 'done',
			tasks: 0,
			fill: 'hsl(var(--chart-1))'
		},
		{
			status: 'remaining',
			tasks: 0,
			fill: 'hsl(var(--chart-2))'
		}
	];
	for (let i = 0; i < tasks.length; i++) {
		const task = tasks[i];
		chartData[0].tasks += task.subTasks.filter(
			(subTask) => subTask.status === 'completed'
		).length;
		chartData[1].tasks += task.subTasks.length - chartData[0].tasks;
	}

	const totalTasks = chartData.reduce((acc, curr) => acc + curr.tasks, 0);

	const doneTasks =
		chartData.find((item) => item.status === 'done')?.tasks || 0;
	const remainingTasks =
		chartData.find((item) => item.status === 'remaining')?.tasks || 0;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>View Task Progress</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Task Progress</DialogTitle>
					<DialogDescription>
						Overview of your task completion status
					</DialogDescription>
				</DialogHeader>
				<Card className="flex flex-col border-0 shadow-none">
					<CardContent className="flex-1 pb-0">
						<ChartContainer
							config={chartConfig}
							className="mx-auto aspect-square max-h-[250px]"
						>
							<PieChart>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Pie
									data={chartData}
									dataKey="tasks"
									nameKey="status"
									innerRadius={60}
									strokeWidth={5}
								>
									<Label
										content={({ viewBox }) => {
											if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
												return (
													<text
														x={viewBox.cx}
														y={viewBox.cy}
														textAnchor="middle"
														dominantBaseline="middle"
													>
														<tspan
															x={viewBox.cx}
															y={viewBox.cy}
															className="fill-foreground text-3xl font-bold"
														>
															{totalTasks}
														</tspan>
														<tspan
															x={viewBox.cx}
															y={(viewBox.cy || 0) + 24}
															className="fill-muted-foreground"
														>
															Total Tasks
														</tspan>
													</text>
												);
											}
										}}
									/>
								</Pie>
							</PieChart>
						</ChartContainer>
					</CardContent>
					<CardFooter className="flex-col gap-2 text-sm">
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<CheckCircle className="h-4 w-4 text-[hsl(var(--chart-1))]" />
								<span>Done</span>
							</div>
							<span className="font-medium">{doneTasks}</span>
						</div>
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<Circle className="h-4 w-4 text-[hsl(var(--chart-2))]" />
								<span>Remaining</span>
							</div>
							<span className="font-medium">{remainingTasks}</span>
						</div>
					</CardFooter>
				</Card>
			</DialogContent>
		</Dialog>
	);
}

const MS_IN_DAY = 24 * 60 * 60 * 1000;

export const isTaskDone = (task) => {
  const status = String(task?.status || '').trim().toLowerCase();
  return status === 'done';
};

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === 'function') return value.toDate();
  if (typeof value === 'object' && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  const normalized = String(value).trim().split(' ')[0];
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatRangeDate = (date) => (
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
);

const getTaskDates = (task) => [
  toDate(task?.createdAt || task?.created_at || task?.startDate),
  toDate(task?.completedAt),
  toDate(task?.deadline || task?.endDate)
].filter(Boolean);

export const buildWeeklyReportMetrics = (tasks = [], referenceDate = new Date()) => {
  const endDate = new Date(referenceDate);
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const days = [];
  let maxTasksInDay = 0;
  let completedThisWeek = 0;

  for (let i = 0; i < 7; i += 1) {
    const dayDate = new Date(startDate.getTime() + i * MS_IN_DAY);
    const dateKey = toDateKey(dayDate);
    const tasksDone = tasks.filter((task) => {
      if (!isTaskDone(task)) return false;
      const completedAt = toDate(task.completedAt);
      return completedAt && toDateKey(completedAt) === dateKey;
    }).length;

    maxTasksInDay = Math.max(maxTasksInDay, tasksDone);
    completedThisWeek += tasksDone;

    days.push({
      id: dateKey,
      date: dateKey,
      dateLabel: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      tasksDone,
      value: 0,
      featured: false
    });
  }

  const weeklyTasks = tasks.filter((task) => (
    getTaskDates(task).some((date) => date >= startDate && date <= endDate)
  ));

  const totalTasks = weeklyTasks.length;
  const completedTasks = weeklyTasks.filter(isTaskDone).length;
  const remainingTasks = Math.max(totalTasks - completedTasks, 0);
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const chartScaleMax = Math.max(maxTasksInDay, 5);
  const average = completedThisWeek / 7;

  const priorityBuckets = weeklyTasks.reduce((acc, task) => {
    const priority = String(task.priority || 'LOW').trim().toUpperCase();
    if (priority === 'CRIT' || priority === 'CRITICAL') acc.critical += 1;
    else if (priority === 'HIGH') acc.high += 1;
    else acc.low += 1;
    return acc;
  }, { critical: 0, high: 0, low: 0 });

  const activePriorityTasks = weeklyTasks.filter((task) => (
    !isTaskDone(task) && ['CRIT', 'CRITICAL', 'HIGH'].includes(String(task.priority || '').trim().toUpperCase())
  )).length;

  const peakDay = days.reduce((best, day) => (
    day.tasksDone > best.tasksDone ? day : best
  ), days[0] || { day: 'N/A', tasksDone: 0 });

  return {
    periodLabel: `${formatRangeDate(startDate)} - ${formatRangeDate(endDate)}`,
    generatedAt: new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(referenceDate),
    data: days.map((day) => ({
      ...day,
      value: (day.tasksDone / chartScaleMax) * 100,
      featured: day.tasksDone === maxTasksInDay && maxTasksInDay > 0
    })),
    average: average.toFixed(1),
    averagePercentage: (average / chartScaleMax) * 100,
    completedThisWeek,
    totalTasks,
    completedTasks,
    remainingTasks,
    completionPercentage,
    priorityBuckets,
    activePriorityTasks,
    peakDay,
    weeklyTasks
  };
};

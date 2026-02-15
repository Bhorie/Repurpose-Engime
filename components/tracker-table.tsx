'use client';

import { useRouter } from 'next/navigation';
import { TweetMetric, Draft } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatDate } from '@/lib/utils';
import { Eye, Heart, Repeat, MessageCircle, TrendingUp } from 'lucide-react';

interface TrackerTableProps {
  metrics: (TweetMetric & { draft: Draft })[];
  currentDays: number;
}

export function TrackerTable({ metrics, currentDays }: TrackerTableProps) {
  const router = useRouter();

  const handleDaysChange = (value: string) => {
    router.push(`/tracker?days=${value}`);
  };

  const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
  const totalEngagements = metrics.reduce((sum, m) => sum + m.engagements, 0);
  const avgReachScore = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.reachScore, 0) / metrics.length
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalImpressions)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagements</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalEngagements)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reach Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgReachScore.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Performance Details</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show last:</span>
          <Select value={currentDays.toString()} onValueChange={handleDaysChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead className="w-[100px]">Impressions</TableHead>
              <TableHead className="w-[120px]">Engagement</TableHead>
              <TableHead className="w-[100px]">Reach Score</TableHead>
              <TableHead className="w-[150px]">Posted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No posted tweets found in this time range.
                </TableCell>
              </TableRow>
            ) : (
              metrics.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{metric.draft.hook}</div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {metric.draft.body}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatNumber(metric.impressions)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="h-3 w-3 text-red-500" />
                        {formatNumber(metric.likes)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Repeat className="h-3 w-3 text-green-500" />
                        {formatNumber(metric.retweets)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        {formatNumber(metric.replies)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-2xl font-bold ${getScoreColor(metric.reachScore)}`}>
                      {Math.round(metric.reachScore)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(metric.postedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

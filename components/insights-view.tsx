'use client';

import { useState } from 'react';
import { Insight, TweetMetric, Draft } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatNumber } from '@/lib/utils';
import { Lightbulb, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

interface InsightsViewProps {
  insight: Insight | null;
  topMetrics: (TweetMetric & { draft: Draft })[];
}

export function InsightsView({ insight, topMetrics }: InsightsViewProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to generate insights. Please try again.');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const recommendations = insight?.recommendations
    ? JSON.parse(insight.recommendations)
    : [];

  const topPerformerIds = insight?.topPerformers
    ? JSON.parse(insight.topPerformers)
    : [];

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Analysis</CardTitle>
              <CardDescription>
                {insight
                  ? `Generated on ${formatDate(insight.createdAt)}`
                  : 'No insights generated yet'}
              </CardDescription>
            </div>
            <Button onClick={handleGenerateInsights} disabled={generating}>
              <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating...' : 'Generate New Insights'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {insight ? (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Week of {formatDate(insight.weekStart)} - {formatDate(insight.weekEnd)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{insight.summary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top-performers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Your Best Posts
                </CardTitle>
                <CardDescription>
                  Top performing content from the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topMetrics.length === 0 ? (
                  <p className="text-muted-foreground">No posts to analyze yet.</p>
                ) : (
                  <div className="space-y-4">
                    {topMetrics.map((metric, index) => (
                      <div
                        key={metric.id}
                        className="flex gap-4 p-4 rounded-lg border bg-muted/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{metric.draft.hook}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {metric.draft.body}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{formatNumber(metric.impressions)} impressions</span>
                            <span>{formatNumber(metric.engagements)} engagements</span>
                            <span className="text-primary font-medium">
                              Reach Score: {Math.round(metric.reachScore)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable ideas based on your performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No insights yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Generate your first weekly analysis to get AI-powered recommendations
            </p>
            <Button onClick={handleGenerateInsights} disabled={generating}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

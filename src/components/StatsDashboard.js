import React, { useState, useMemo } from 'react';

export const StatsDashboard = ({ urls, categories }) => {
  const [expandedCard, setExpandedCard] = useState(null);

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Basic counts
    const totalUrls = urls.length;
    const totalCategories = categories.length;

    // Health statistics
    const healthyUrls = urls.filter(url => url.isHealthy === true).length;
    const unhealthyUrls = urls.filter(url => url.isHealthy === false).length;
    const uncheckedUrls = urls.filter(url => url.isHealthy === null).length;

    // Time-based statistics
    const urlsToday = urls.filter(url => new Date(url.added) >= todayStart).length;
    const urlsThisWeek = urls.filter(url => new Date(url.added) >= weekStart).length;
    const urlsThisMonth = urls.filter(url => new Date(url.added) >= monthStart).length;

    // Category distribution
    const categoryStats = categories.map(category => {
      const categoryUrls = urls.filter(url => url.category === category);
      const healthyInCategory = categoryUrls.filter(url => url.isHealthy === true).length;
      
      return {
        name: category,
        count: categoryUrls.length,
        healthy: healthyInCategory,
        percentage: totalUrls > 0 ? Math.round((categoryUrls.length / totalUrls) * 100) : 0,
        healthPercentage: categoryUrls.length > 0 ? Math.round((healthyInCategory / categoryUrls.length) * 100) : 0
      };
    }).sort((a, b) => b.count - a.count);

    // Protocol distribution
    const httpsUrls = urls.filter(url => url.url.startsWith('https://')).length;
    const httpUrls = urls.filter(url => url.url.startsWith('http://') && !url.url.startsWith('https://')).length;

    // Response time statistics
    const urlsWithResponseTime = urls.filter(url => url.healthData?.responseTime);
    const avgResponseTime = urlsWithResponseTime.length > 0 
      ? Math.round(urlsWithResponseTime.reduce((sum, url) => sum + url.healthData.responseTime, 0) / urlsWithResponseTime.length)
      : 0;

    const fastUrls = urlsWithResponseTime.filter(url => url.healthData.responseTime < 1000).length;
    const slowUrls = urlsWithResponseTime.filter(url => url.healthData.responseTime >= 3000).length;

    // Growth trends
    const growthTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      const count = urls.filter(url => {
        const urlDate = new Date(url.added);
        return urlDate >= date && urlDate < nextDate;
      }).length;
      
      growthTrend.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      });
    }

    // Most common domains
    const domainCounts = {};
    urls.forEach(url => {
      try {
        const domain = new URL(url.url).hostname.replace('www.', '');
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      } catch (error) {
        // Invalid URL, skip
      }
    });

    const topDomains = Object.entries(domainCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    return {
      totalUrls,
      totalCategories,
      healthyUrls,
      unhealthyUrls,
      uncheckedUrls,
      urlsToday,
      urlsThisWeek,
      urlsThisMonth,
      categoryStats,
      httpsUrls,
      httpUrls,
      avgResponseTime,
      fastUrls,
      slowUrls,
      growthTrend,
      topDomains,
      healthPercentage: totalUrls > 0 ? Math.round((healthyUrls / totalUrls) * 100) : 0,
      securityScore: totalUrls > 0 ? Math.round((httpsUrls / totalUrls) * 100) : 0
    };
  }, [urls, categories]);

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  if (urls.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '20px' }}>
          📊 Analytics Dashboard
        </h3>
        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
          Insights and statistics about your URL collection
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <OverviewCard
          title="Total Collection"
          value={stats.totalUrls}
          subtitle={`${stats.totalCategories} categories`}
          icon="🔗"
          color="#3b82f6"
        />
        
        <OverviewCard
          title="Health Score"
          value={`${stats.healthPercentage}%`}
          subtitle={`${stats.healthyUrls} healthy, ${stats.unhealthyUrls} issues`}
          icon="🏥"
          color={stats.healthPercentage >= 80 ? "#10b981" : stats.healthPercentage >= 60 ? "#f59e0b" : "#ef4444"}
        />
        
        <OverviewCard
          title="Security Score"
          value={`${stats.securityScore}%`}
          subtitle={`${stats.httpsUrls} HTTPS, ${stats.httpUrls} HTTP`}
          icon="🔒"
          color={stats.securityScore >= 80 ? "#10b981" : stats.securityScore >= 60 ? "#f59e0b" : "#ef4444"}
        />
        
        <OverviewCard
          title="Avg Response"
          value={stats.avgResponseTime > 0 ? `${stats.avgResponseTime}ms` : 'N/A'}
          subtitle={`${stats.fastUrls} fast, ${stats.slowUrls} slow`}
          icon="⚡"
          color={stats.avgResponseTime < 1000 ? "#10b981" : stats.avgResponseTime < 2000 ? "#f59e0b" : "#ef4444"}
        />
      </div>

      {/* Detailed Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        
        {/* Growth Trend */}
        <AnalyticsCard
          id="growth"
          title="📈 7-Day Growth"
          expanded={expandedCard === 'growth'}
          onToggle={() => toggleCard('growth')}
        >
          <div style={{ display: 'flex', alignItems: 'end', gap: '4px', height: '60px', marginBottom: '12px' }}>
            {stats.growthTrend.map((day, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '100%',
                  backgroundColor: '#3b82f6',
                  borderRadius: '2px 2px 0 0',
                  height: `${Math.max(day.count * 15, 4)}px`,
                  marginBottom: '4px'
                }} />
                <span style={{ fontSize: '10px', color: '#6b7280' }}>{day.date}</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#111827' }}>{day.count}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Added this week: {stats.urlsThisWeek} URLs • Today: {stats.urlsToday} URLs
          </div>
        </AnalyticsCard>

        {/* Category Distribution */}
        <AnalyticsCard
          id="categories"
          title="🗂️ Category Breakdown"
          expanded={expandedCard === 'categories'}
          onToggle={() => toggleCard('categories')}
        >
          <div style={{ space: '8px' }}>
            {stats.categoryStats.slice(0, 5).map((category, index) => (
              <div key={category.name} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                    {category.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {category.count} ({category.percentage}%)
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${category.percentage}%`,
                    height: '100%',
                    backgroundColor: `hsl(${index * 60}, 60%, 50%)`,
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Top Domains */}
        <AnalyticsCard
          id="domains"
          title="🌐 Popular Domains"
          expanded={expandedCard === 'domains'}
          onToggle={() => toggleCard('domains')}
        >
          <div>
            {stats.topDomains.map((domain, index) => (
              <div key={domain.domain} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < stats.topDomains.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '18px',
                    width: '20px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    #{index + 1}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {domain.domain}
                  </span>
                </div>
                <span style={{ 
                  fontSize: '13px', 
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {domain.count} URL{domain.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
            {stats.topDomains.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', padding: '16px' }}>
                No domain data available
              </div>
            )}
          </div>
        </AnalyticsCard>

        {/* Recent Activity */}
        <AnalyticsCard
          id="activity"
          title="🕒 Recent Activity"
          expanded={expandedCard === 'activity'}
          onToggle={() => toggleCard('activity')}
        >
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
                {stats.urlsThisMonth}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>URLs added this month</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#3b82f6' }}>
                  {stats.urlsThisWeek}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>This Week</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                  {stats.urlsToday}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Today</div>
              </div>
            </div>
          </div>
        </AnalyticsCard>

      </div>

      {/* Quick Insights */}
      <div style={{ 
        marginTop: '20px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #f3f4f6'
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
          💡 Quick Insights
        </h4>
        <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
          {getInsights(stats).map((insight, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              • {insight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Overview Card Component
const OverviewCard = ({ title, value, subtitle, icon, color }) => (
  <div style={{ 
    background: '#f9fafb',
    border: '1px solid #f3f4f6',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ 
      fontSize: '24px', 
      fontWeight: '700', 
      color: color,
      marginBottom: '4px'
    }}>
      {value}
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280' }}>{title}</div>
    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{subtitle}</div>
  </div>
);

// Analytics Card Component
const AnalyticsCard = ({ id, title, children, expanded, onToggle }) => (
  <div style={{ 
    background: '#f9fafb',
    border: '1px solid #f3f4f6',
    borderRadius: '8px',
    padding: '16px'
  }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '12px',
      cursor: 'pointer'
    }} onClick={onToggle}>
      <h4 style={{ margin: 0, fontSize: '14px', color: '#374151' }}>{title}</h4>
      <span style={{ 
        fontSize: '12px', 
        color: '#6b7280',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s'
      }}>
        ▼
      </span>
    </div>
    {children}
  </div>
);

// Generate insights based on statistics
const getInsights = (stats) => {
  const insights = [];
  
  if (stats.healthPercentage >= 90) {
    insights.push("Excellent! Your URL collection is very healthy.");
  } else if (stats.unhealthyUrls > 0) {
    insights.push(`${stats.unhealthyUrls} URLs need attention - consider checking or removing them.`);
  }

  if (stats.securityScore < 80) {
    insights.push(`Consider upgrading ${stats.httpUrls} HTTP URLs to HTTPS for better security.`);
  }

  if (stats.avgResponseTime > 3000) {
    insights.push("Some URLs have slow response times - they might be experiencing issues.");
  }

  if (stats.categoryStats[0]?.percentage > 50) {
    insights.push(`Most URLs (${stats.categoryStats[0].percentage}%) are in "${stats.categoryStats[0].name}" category.`);
  }

  if (stats.urlsThisWeek > stats.urlsThisMonth / 4) {
    insights.push("You're actively adding URLs - great collection building!");
  }

  if (insights.length === 0) {
    insights.push("Your URL collection looks great! Keep adding and organizing your links.");
  }

  return insights.slice(0, 3); // Show max 3 insights
};
/*
 File: CoursesPage.tsx
 Path: src/features/dashboard/pages/CoursesPage.tsx
 Description: Course offerings + available dates list for operator dashboard.
 Author: AQUORIX Phase 10
 Version: 1.1.0
 Created: 2026-03-23
 Last Updated: 2026-03-25
 Status: In Progress

 Change Log:
 - 2026-03-23 - Initial creation (Phase 10 UI)
 - 2026-03-23 - Fix route wiring to live backend response shape
 - 2026-03-25 - Add inline View Dates expansion for scheduled course dates
*/

import React, { useEffect, useMemo, useState } from 'react';

type CourseRun = {
  course_run_id: string;
  start_at: string;
  end_at: string;
  max_capacity: number;
  status: string;
  linked_session_ids: number[];
  location?: string | null;
  notes?: string | null;
};

type Course = {
  course_offering_id: number;
  title: string;
  certification_agency: string;
  course_level: string;
  base_price_minor: number;
  currency: string;
  max_students: number;
  active_flag: boolean;
  runs: CourseRun[];
};

const formatMoney = (amountMinor: number, currency: string): string => {
  return `${(Number(amountMinor) / 100).toFixed(2)} ${currency}`;
};

const formatDisplayDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getDurationDays = (startAt: string, endAt: string): number => {
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = Math.ceil(diffInMs / millisecondsPerDay);

  return Math.max(1, diffInDays);
};

const formatStatus = (status: string): string => {
  if (!status) {
    return 'Unknown';
  }

  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  // TEMP: hardcode operator 146 (Poseidon test operator)
  const operatorId = 146;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/v3/operator/${operatorId}/courses`);
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [operatorId]);

  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => a.title.localeCompare(b.title));
  }, [courses]);

  const toggleDates = (courseOfferingId: number) => {
    setExpandedCourseId((prev) =>
      prev === courseOfferingId ? null : courseOfferingId
    );
  };

  return (
    <div className="aqx-main-inner">
      <div className="aqx-main-header">
        <h1>Courses</h1>
        <p>Manage your course offerings and available dates.</p>
      </div>

      {loading && <p>Loading courses...</p>}

      {!loading && sortedCourses.length === 0 && (
        <div className="aqx-card">
          <p>No courses found for this operator.</p>
        </div>
      )}

      {!loading && sortedCourses.length > 0 && (
        <div className="aqx-metric-grid">
          {sortedCourses.map((course) => {
            const isExpanded = expandedCourseId === course.course_offering_id;
            const sortedRuns = [...course.runs].sort(
              (a, b) =>
                new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
            );

            return (
              <div key={course.course_offering_id} className="aqx-card">
                <h3>{course.title}</h3>

                <p>
                  {course.certification_agency} • {course.course_level}
                </p>

                <p>Price: {formatMoney(course.base_price_minor, course.currency)}</p>

                <p>Max Students: {course.max_students}</p>

                <p>Available Dates: {course.runs.length}</p>

                <button
                  type="button"
                  className="aqx-btn-primary"
                  onClick={() => toggleDates(course.course_offering_id)}
                >
                  {isExpanded ? 'Hide Dates' : 'View Dates'}
                </button>

                {isExpanded && (
                  <div style={{ marginTop: '16px' }}>
                    {sortedRuns.length === 0 ? (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '12px',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '12px',
                        }}
                      >
                        <p style={{ margin: 0 }}>No scheduled dates available yet.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                        {sortedRuns.map((run) => (
                          <div
                            key={run.course_run_id}
                            style={{
                              padding: '16px',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '12px',
                            }}
                          >
                            <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
                              {formatDisplayDate(run.start_at)} - {formatDisplayDate(run.end_at)}
                            </p>

                            <p style={{ margin: '0 0 6px 0' }}>
                              Duration: {getDurationDays(run.start_at, run.end_at)} day
                              {getDurationDays(run.start_at, run.end_at) === 1 ? '' : 's'}
                            </p>

                            <p style={{ margin: '0 0 6px 0' }}>
                              Capacity: {run.max_capacity}
                            </p>

                            <p style={{ margin: '0 0 6px 0' }}>
                              Status: {formatStatus(run.status)}
                            </p>

                            <p style={{ margin: '0 0 6px 0' }}>
                              Location: {run.location && run.location.trim() ? run.location : 'TBD'}
                            </p>

                            <p style={{ margin: '0 0 6px 0' }}>
                              Linked Dives: {run.linked_session_ids?.length || 0}
                            </p>

                            {run.notes && run.notes.trim() && (
                              <p style={{ margin: '0 0 6px 0' }}>
                                Notes: {run.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;

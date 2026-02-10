"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ExternalLink,
  Github,
  CheckCircle,
  Clock,
  AlertCircle,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

function Projects() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        // Ensure projects is always an array
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("status.completed")}
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600">
            <Clock className="h-3 w-3 mr-1" />
            {t("status.in-progress")}
          </Badge>
        );
      case "planned":
        return (
          <Badge variant="outline" className="bg-yellow-500 hover:bg-yellow-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t("status.planned")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t("title")}</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t("no_projects")}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    },
                  },
                }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full flex flex-col border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Project Image */}
                  {project.images && project.images.length > 0 && (
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={project.images[0]}
                        alt={`${project.title} screenshot`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {project.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          +{project.images.length - 1} {t("images")}
                        </div>
                      )}
                    </div>
                  )}

                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(project.status)}
                          <Badge variant="outline" className="text-sm">
                            {t("priority")} {project.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <CardDescription className="text-base leading-relaxed">
                      {locale === 'fr' ? project.description_fr : project.description_en || project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-sm">
                          <Tag className="h-3 w-3 mr-1" />
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex items-center gap-2"
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                            {t("code")}
                          </a>
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button
                          size="sm"
                          asChild
                          className="flex items-center gap-2"
                        >
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {t("demo")}
                          </a>
                        </Button>
                      )}
                    </div>

                    {/* Project Links */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {t("created")}: {new Date(project.createdAt).toLocaleDateString(locale)}
                      </span>
                      {project.updatedAt && (
                        <span>
                          {t("updated")}: {new Date(project.updatedAt).toLocaleDateString(locale)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Projects;
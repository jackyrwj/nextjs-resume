"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Calendar,
  Award,
  Code,
  Briefcase,
  GraduationCap,
  Download,
  Printer,
} from "lucide-react";

export default function Resume() {
  const [editMode, setEditMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveToDatabase = async () => {
    try {
      const testUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;
      if (!testUserId) {
        alert(
          "缺少 NEXT_PUBLIC_TEST_USER_ID，请在 .env.local 配置一个测试用户ID"
        );
        return;
      }
      const res = await fetch("/api/save-resume-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: testUserId,
          personalInfo,
          experience,
          education,
          skills,
          projects,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "保存失败");
      }
      alert("已保存到数据库");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "保存失败";
      alert(msg);
    }
  };
  // PDF下载功能
  const downloadPDF = () => {
    window.print();
  };

  const exportPDF = () => {
    // 创建一个新窗口用于打印
    const printWindow = window.open("", "_blank");

    // **关键修改：检查 printWindow 是否为 null**
    if (printWindow) {
      // 获取需要打印的内容的 outerHTML，并处理可能为 null 的情况
      const resumeContent =
        document.querySelector(".max-w-4xl")?.outerHTML || "";

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${personalInfo.name} - 简历</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              /* A4 纸张与边距 */
              @page { size: A4; margin: 10mm; }
              html, body { height: 100%; background: #fff; }
              body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

              /* 仅打印时的调整 */
              @media print {
                .no-print { display: none !important; }
                .print-break { page-break-before: always; }
                .shadow-2xl { box-shadow: none !important; }
                .bg-gradient-to-br, .bg-gradient-to-r { background: #fff !important; }
                /* 让主简历容器适配 A4 宽度并避免被裁切 */
                .resume-sheet { width: 190mm !important; min-height: 277mm !important; margin: 0 auto !important; }
                .resume-sheet * { break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            ${resumeContent}
          </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      // 提示用户可能被阻止了弹窗
      alert("无法打开打印窗口，请检查浏览器设置是否阻止了弹出窗口。");
    }
  };

  // 高级PDF下载功能（如果安装了jspdf和html2canvas）
  const downloadAdvancedPDF = async () => {
    try {
      // 动态导入库（如果已安装）
      const jsPDF = await import("jspdf").then((m) => m.default);
      const html2canvas = await import("html2canvas").then((m) => m.default);

      // **关键修改：使用类型断言将 Element 转换为 HTMLElement**
      const element = document.querySelector(".max-w-4xl") as HTMLElement;
      if (!element) {
        console.error("无法找到要转换为PDF的元素 (.max-w-4xl)");
        return;
      }

      // 导出前临时应用更适合 PDF 的样式
      const style = document.createElement("style");
      style.setAttribute("data-pdf-style", "true");
      style.innerHTML = `
        .pdf-export .bg-gradient-to-r, .pdf-export .bg-gradient-to-br { background: #ffffff !important; }
        .pdf-export .shadow-2xl { box-shadow: none !important; }
        .pdf-export .rounded-2xl { border-radius: 0 !important; }
        .pdf-export .no-print { display: none !important; }
        .pdf-export .resume-sheet { width: 794px !important; margin: 0 auto !important; }
        /* Replace Tailwind v4 oklab/oklch colors with hex to satisfy html2canvas */
        .pdf-export .text-blue-600 { color: #2563eb !important; }
        .pdf-export .text-blue-100 { color: #dbeafe !important; }
        .pdf-export .text-gray-800 { color: #1f2937 !important; }
        .pdf-export .text-gray-700 { color: #374151 !important; }
        .pdf-export .text-gray-600 { color: #4b5563 !important; }
        .pdf-export .text-gray-500 { color: #6b7280 !important; }
        .pdf-export .bg-gray-50 { background-color: #f9fafb !important; }
        .pdf-export .border-blue-500 { border-color: #3b82f6 !important; }
        .pdf-export .text-purple-800 { color: #6b21a8 !important; }
        .pdf-export .bg-purple-50 { background-color: #faf5ff !important; }
      `;
      document.head.appendChild(style);
      document.body.classList.add("pdf-export");

      const originalWidth = element.style.width;
      element.style.width = "794px"; // 794px ≈ 210mm at 96dpi

      // 生成canvas
      const canvas = await html2canvas(element, {
        scale: 2, // 提高分辨率
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 添加第一页
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 如果内容超过一页，添加新页
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 下载PDF
      pdf.save(`${personalInfo.name}-简历.pdf`);

      // 还原样式
      element.style.width = originalWidth;
      document.body.classList.remove("pdf-export");
      style.remove();
    } catch (error) {
      console.log("高级PDF功能未可用，使用浏览器打印功能");
      console.error("高级PDF功能错误:", error); // 打印详细错误信息
      downloadPDF();
    }
  };

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
  });

  const [experience, setExperience] = useState<
    Array<{
      company: string;
      position: string;
      period: string;
      description: string[];
    }>
  >([]);

  const [education, setEducation] = useState<
    Array<{ school: string; degree?: string; period?: string; gpa?: string }>
  >([]);

  const [skills, setSkills] = useState<{
    frontend: string[];
    tools: string[];
    backend: string[];
    other: string[];
  }>({
    frontend: [],
    tools: [],
    backend: [],
    other: [],
  });

  const [projects, setProjects] = useState<
    Array<{
      name: string;
      tech?: string;
      period?: string;
      description?: string;
    }>
  >([]);

  const updateExperienceField = (idx: number, field: string, value: string) => {
    setExperience((prev) => {
      const next = [...prev];
      (next[idx] as any)[field] = value;
      return next;
    });
  };

  const updateExperienceDesc = (idx: number, text: string) => {
    const lines = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    setExperience((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], description: lines };
      return next;
    });
  };

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      { company: "", position: "", period: "", description: [] },
    ]);
  };

  const removeExperience = (idx: number) => {
    setExperience((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateProjectField = (idx: number, field: string, value: string) => {
    setProjects((prev) => {
      const next = [...prev];
      (next[idx] as any)[field] = value;
      return next;
    });
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { name: "", tech: "", period: "", description: "" },
    ]);
  };

  const removeProject = (idx: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateEducationField = (idx: number, field: string, value: string) => {
    setEducation((prev) => {
      const next = [...prev];
      (next[idx] as any)[field] = value;
      return next;
    });
  };

  useEffect(() => {
    const testUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;
    if (!testUserId) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/get-resume-single?userId=${encodeURIComponent(testUserId)}`
        );
        if (!res.ok) return;
        const json = await res.json();
        const data = json?.data;
        if (data) {
          setPersonalInfo(data.personalInfo);
          if (Array.isArray(data.experience)) setExperience(data.experience);
          if (Array.isArray(data.education)) setEducation(data.education);
          if (Array.isArray(data.projects)) setProjects(data.projects);
          if (data.skills) setSkills(data.skills);
        }
      } catch {}
      setIsLoaded(true);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      {/* 右上角操作按钮 */}
      <div className="fixed top-4 right-4 z-50 no-print">
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode((v) => !v)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
            title="编辑模式"
          >
            {editMode ? "完成编辑" : "编辑"}
          </button>
          <button
            onClick={saveToDatabase}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
            title="保存到数据库"
          >
            保存到数据库
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none resume-sheet">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
              {personalInfo.name.charAt(0)}
            </div>
            <div className="text-center md:text-left flex-1">
              {editMode ? (
                <div className="space-y-2">
                  <input
                    className="w-full text-4xl font-bold text-black px-3 py-2 rounded"
                    value={personalInfo.name}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, name: e.target.value })
                    }
                  />
                  <input
                    className="w-full text-lg text-black/80 px-3 py-2 rounded"
                    value={personalInfo.title || ""}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-2">
                    {personalInfo.name}
                  </h1>
                  <p className="text-xl text-blue-100 mb-4">
                    {personalInfo.title}
                  </p>
                </>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  {editMode ? (
                    <input
                      className="px-2 py-1 rounded text-black"
                      value={personalInfo.email || ""}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{personalInfo.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  {editMode ? (
                    <input
                      className="px-2 py-1 rounded text-black"
                      value={personalInfo.phone || ""}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{personalInfo.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {editMode ? (
                    <input
                      className="px-2 py-1 rounded text-black"
                      value={personalInfo.location || ""}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          location: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{personalInfo.location}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Briefcase className="text-blue-600" size={24} />
                  工作经历
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-6 pb-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        {editMode ? (
                          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <input
                              className="text-xl font-semibold text-gray-800 px-2 py-1 rounded w-full sm:w-1/2"
                              value={exp.position}
                              onChange={(e) =>
                                updateExperienceField(
                                  index,
                                  "position",
                                  e.target.value
                                )
                              }
                            />
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar size={14} />
                              <input
                                className="px-2 py-1 rounded text-black"
                                value={exp.period || ""}
                                onChange={(e) =>
                                  updateExperienceField(
                                    index,
                                    "period",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {exp.position}
                            </h3>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar size={14} />
                              {exp.period}
                            </span>
                          </>
                        )}
                      </div>
                      {editMode ? (
                        <div className="space-y-2">
                          <input
                            className="text-blue-600 font-medium mb-3 w-full px-2 py-1 rounded"
                            value={exp.company}
                            onChange={(e) =>
                              updateExperienceField(
                                index,
                                "company",
                                e.target.value
                              )
                            }
                          />
                          <textarea
                            className="w-full border rounded px-3 py-2 text-sm"
                            rows={4}
                            placeholder="每行一条描述"
                            value={(exp.description || []).join("\n")}
                            onChange={(e) =>
                              updateExperienceDesc(index, e.target.value)
                            }
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => removeExperience(index)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              删除经历
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-blue-600 font-medium mb-3">
                            {exp.company}
                          </p>
                          <ul className="space-y-2">
                            {exp.description.map((desc, i) => (
                              <li
                                key={i}
                                className="text-gray-600 flex items-start gap-2"
                              >
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                {desc}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={addExperience}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      + 添加经历
                    </button>
                  )}
                </div>
              </section>

              {/* Projects Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Code className="text-blue-600" size={24} />
                  项目经历
                </h2>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      {editMode ? (
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                            <input
                              className="text-lg font-semibold text-gray-800 px-2 py-1 rounded w-full sm:w-1/2"
                              value={project.name}
                              onChange={(e) =>
                                updateProjectField(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              className="text-sm text-gray-700 px-2 py-1 rounded w-full sm:w-1/2"
                              placeholder="时间"
                              value={project.period || ""}
                              onChange={(e) =>
                                updateProjectField(
                                  index,
                                  "period",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <input
                            className="text-blue-600 text-sm font-medium mb-2 w-full px-2 py-1 rounded"
                            placeholder="技术栈"
                            value={project.tech || ""}
                            onChange={(e) =>
                              updateProjectField(index, "tech", e.target.value)
                            }
                          />
                          <textarea
                            className="w-full border rounded px-3 py-2 text-sm"
                            rows={3}
                            value={project.description || ""}
                            onChange={(e) =>
                              updateProjectField(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => removeProject(index)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              删除项目
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {project.name}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {project.period}
                            </span>
                          </div>
                          <p className="text-blue-600 text-sm font-medium mb-2">
                            {project.tech}
                          </p>
                          <p className="text-gray-600">{project.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={addProject}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      + 添加项目
                    </button>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Contact & Links */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  联系方式
                </h2>
                <div className="space-y-3">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail size={16} />
                    <span className="text-sm">{personalInfo.email}</span>
                  </a>
                  <a
                    href={personalInfo.github}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Github size={16} />
                    <span className="text-sm">GitHub</span>
                  </a>
                  <a
                    href={personalInfo.linkedin}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={16} />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a
                    href={personalInfo.website}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Globe size={16} />
                    <span className="text-sm">个人网站</span>
                  </a>
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <GraduationCap size={20} />
                  教育背景
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4"
                    >
                      {editMode ? (
                        <div className="space-y-2">
                          <input
                            className="font-semibold text-gray-800 w-full px-2 py-1 rounded"
                            value={edu.school}
                            onChange={(e) =>
                              updateEducationField(
                                index,
                                "school",
                                e.target.value
                              )
                            }
                          />
                          <input
                            className="text-sm text-blue-600 w-full px-2 py-1 rounded"
                            value={edu.degree || ""}
                            onChange={(e) =>
                              updateEducationField(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                          />
                          <input
                            className="text-xs text-gray-700 w-full px-2 py-1 rounded"
                            value={edu.period || ""}
                            onChange={(e) =>
                              updateEducationField(
                                index,
                                "period",
                                e.target.value
                              )
                            }
                          />
                          <input
                            className="text-xs text-gray-700 w-full px-2 py-1 rounded"
                            value={edu.gpa || ""}
                            onChange={(e) =>
                              updateEducationField(index, "gpa", e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-800">
                            {edu.school}
                          </h3>
                          <p className="text-sm text-blue-600 mb-1">
                            {edu.degree}
                          </p>
                          <p className="text-xs text-gray-500">{edu.period}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {edu.gpa}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award size={20} />
                  技能特长
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      前端技术
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {editMode ? (
                        <textarea
                          className="w-full border rounded px-3 py-2 text-sm"
                          rows={2}
                          placeholder="用逗号分隔"
                          value={skills.frontend.join(", ")}
                          onChange={(e) =>
                            setSkills({
                              ...skills,
                              frontend: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      ) : (
                        skills.frontend.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      开发工具
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {editMode ? (
                        <textarea
                          className="w-full border rounded px-3 py-2 text-sm"
                          rows={2}
                          placeholder="用逗号分隔"
                          value={skills.tools.join(", ")}
                          onChange={(e) =>
                            setSkills({
                              ...skills,
                              tools: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      ) : (
                        skills.tools.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      后端相关
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {editMode ? (
                        <textarea
                          className="w-full border rounded px-3 py-2 text-sm"
                          rows={2}
                          placeholder="用逗号分隔"
                          value={skills.backend.join(", ")}
                          onChange={(e) =>
                            setSkills({
                              ...skills,
                              backend: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      ) : (
                        skills.backend.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      其他技能
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {editMode ? (
                        <textarea
                          className="w-full border rounded px-3 py-2 text-sm"
                          rows={2}
                          placeholder="用逗号分隔"
                          value={skills.other.join(", ")}
                          onChange={(e) =>
                            setSkills({
                              ...skills,
                              other: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      ) : (
                        skills.other.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 text-center text-gray-500 text-sm print:bg-white">
          <p>此简历使用 Next.js + Tailwind CSS 构建</p>
        </div>
      </div>
    </div>
  );
}

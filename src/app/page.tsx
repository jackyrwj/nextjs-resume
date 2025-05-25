'use client';

import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, Award, Code, Briefcase, GraduationCap, Download, Printer } from 'lucide-react';

export default function Resume() {
  // PDF下载功能
  const downloadPDF = () => {
    window.print();
  };

  const exportPDF = () => {
    // 创建一个新窗口用于打印
    const printWindow = window.open('', '_blank');

    // **关键修改：检查 printWindow 是否为 null**
    if (printWindow) {
      const currentContent = document.documentElement.outerHTML;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${personalInfo.name} - 简历</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
                .print-break { page-break-before: always; }
                .shadow-2xl { box-shadow: none !important; }
                .bg-gradient-to-br { background: white !important; }
              }
            </style>
          </head>
          <body>
            ${document.querySelector('.max-w-4xl')?.outerHTML || ''}
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
      alert('无法打开打印窗口，请检查浏览器设置是否阻止了弹出窗口。');
    }
  };

  // 高级PDF下载功能（如果安装了jspdf和html2canvas）
  const downloadAdvancedPDF = async () => {
    try {
      // 动态导入库（如果已安装）
      const jsPDF = await import('jspdf').then(m => m.default);
      const html2canvas = await import('html2canvas').then(m => m.default);

      const element = document.querySelector('.max-w-4xl');
      if (!element) return;

      // 生成canvas
      const canvas = await html2canvas(element, {
        scale: 2, // 提高分辨率
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 添加第一页
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 如果内容超过一页，添加新页
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 下载PDF
      pdf.save(`${personalInfo.name}-简历.pdf`);
    } catch (error) {
      console.log('高级PDF功能未可用，使用浏览器打印功能');
      downloadPDF();
    }
  };

  const personalInfo = {
    name: "张三",
    title: "前端开发工程师",
    email: "zhangsan@example.com",
    phone: "+86 138 0000 0000",
    location: "北京市",
    website: "https://zhangsan.dev",
    github: "https://github.com/zhangsan",
    linkedin: "https://linkedin.com/in/zhangsan"
  };

  const experience = [
    {
      company: "科技有限公司",
      position: "高级前端开发工程师",
      period: "2022.03 - 至今",
      description: [
        "负责公司核心产品的前端架构设计和开发，使用 React/Next.js 技术栈",
        "优化应用性能，首屏加载时间减少40%，提升用户体验",
        "带领3人前端团队，制定代码规范和开发流程",
        "参与产品需求评审，与后端、设计团队紧密协作"
      ]
    },
    {
      company: "互联网公司",
      position: "前端开发工程师",
      period: "2020.06 - 2022.02",
      description: [
        "开发和维护多个 Web 应用，涉及电商、内容管理等业务场景",
        "使用 Vue.js 构建响应式用户界面，兼容多种设备和浏览器",
        "集成第三方 API 和支付系统，确保系统稳定性和安全性",
        "参与敏捷开发流程，按时交付高质量的产品功能"
      ]
    }
  ];

  const education = [
    {
      school: "北京理工大学",
      degree: "计算机科学与技术 学士",
      period: "2016.09 - 2020.06",
      gpa: "GPA: 3.8/4.0"
    }
  ];

  const skills = {
    frontend: ["JavaScript/TypeScript", "React.js", "Next.js", "Vue.js", "HTML5/CSS3", "Tailwind CSS"],
    tools: ["Git", "Webpack", "Vite", "Docker", "Figma", "VS Code"],
    backend: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    other: ["RESTful API", "GraphQL", "Jest", "Cypress", "AWS", "Vercel"]
  };

  const projects = [
    {
      name: "电商管理平台",
      tech: "Next.js, TypeScript, Tailwind CSS",
      period: "2023.01 - 2023.06",
      description: "为中小企业打造的一站式电商管理解决方案，包含商品管理、订单处理、数据分析等功能模块。"
    },
    {
      name: "实时协作工具",
      tech: "React, Socket.io, Node.js",
      period: "2022.08 - 2022.12",
      description: "支持多人实时协作的在线文档编辑工具，实现了实时同步、权限管理和版本控制功能。"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      {/* 下载按钮 - 固定在右上角 */}
      <div className="fixed top-4 right-4 z-50 no-print">
        <div className="flex gap-2">
          <button
            onClick={downloadAdvancedPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
            title="下载高质量PDF"
          >
            <Download size={16} />
            <span className="hidden sm:inline">下载PDF</span>
          </button>
          <button
            onClick={exportPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
            title="打印预览"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">打印</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
              {personalInfo.name.charAt(0)}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{personalInfo.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{personalInfo.title}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{personalInfo.location}</span>
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
                    <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={14} />
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium mb-3">{exp.company}</p>
                      <ul className="space-y-2">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
                    <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                        <span className="text-sm text-gray-500">{project.period}</span>
                      </div>
                      <p className="text-blue-600 text-sm font-medium mb-2">{project.tech}</p>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Contact & Links */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">联系方式</h2>
                <div className="space-y-3">
                  <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail size={16} />
                    <span className="text-sm">{personalInfo.email}</span>
                  </a>
                  <a href={personalInfo.github} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Github size={16} />
                    <span className="text-sm">GitHub</span>
                  </a>
                  <a href={personalInfo.linkedin} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Linkedin size={16} />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a href={personalInfo.website} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
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
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                      <p className="text-sm text-blue-600 mb-1">{edu.degree}</p>
                      <p className="text-xs text-gray-500">{edu.period}</p>
                      <p className="text-xs text-gray-600 mt-1">{edu.gpa}</p>
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
                    <h3 className="font-semibold text-gray-700 mb-2">前端技术</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.frontend.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">开发工具</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.tools.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">后端相关</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.backend.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">其他技能</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.other.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
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
"use client";
import {cn} from "@/lib/utils";
import React from "react";
import {BentoGrid, BentoGridItem} from "@/components/ui/bento-grid";
import {Award, BookOpen, ClipboardCheck, Columns, Edit, Eye, Shield,} from "lucide-react";
import {motion} from "framer-motion";
import Image from "next/image";
import {FlipWords} from "@/components/ui/flip-words";

export function BentoGridDashboard() {
    return (
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
            {items.map((item, i) => (

                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    className={cn("[&>p:text-lg]", item.className)}
                    icon={item.icon}
                    link={item.link}
                />
            ))}
        </BentoGrid>
    );
}

const SkeletonTwo = () => {
        return (
        <div
            className={
                'dark:shadow-none overflow-hidden rounded-lg border dark:border-neutral-800 border-neutral-300 w-full'
            }
        >
            <div className={'absolute p-4 dark:text-neutral-100 text-neutral-900'}>
                <div className={'font-medium'}>This Month:</div>
                <div className={'font-bold text-3xl'}>+300%</div>
            </div>
            <div className={'dark:bg-neutral-950 bg-white dark:bg-grid-neutral-700 bg-grid-neutral-200'}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 653 465">
                    <motion.path
                        transition={{delay: 0.3}}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        d="M0 460.694c6.6-3.13 19.8-11.272 33-15.654s19.8-2.814 33-6.257 19.8.365 33-10.955 19.8-32.07 33-45.643c13.2-13.572 19.8-16.08 33-22.22s19.8-5.647 33-8.48c13.2-2.832 19.8 5.901 33-5.68 13.2-11.582 19.8-37.759 33-52.226 13.2-14.468 19.8-28.263 33-20.112 13.2 8.15 19.8 59.038 33 60.863 13.2 1.824 19.8-43.269 33-51.741s19.8 24.488 33 9.38c13.2-15.11 19.8-81.825 33-84.923s19.8 54.76 33 69.432 19.8 34.912 33 3.931 19.8-148.752 33-158.837c13.2-10.086 19.8 111.943 33 108.409 13.2-3.535 19.8-97.635 33-126.082s19.8-7.562 33-16.152 26.4-21.438 33-26.798L653 465H0Z"
                        className={'dark:fill-sky-800 fill-purple-200'}
                    />
                    <motion.path
                        transition={{duration: 0.4}}
                        initial={{pathLength: 0}}
                        animate={{pathLength: 1}}
                        d="M0 460.694c6.6-3.13 19.8-11.272 33-15.654s19.8-2.814 33-6.257 19.8.365 33-10.955 19.8-32.07 33-45.643c13.2-13.572 19.8-16.08 33-22.22s19.8-5.647 33-8.48c13.2-2.832 19.8 5.901 33-5.68 13.2-11.582 19.8-37.759 33-52.226 13.2-14.468 19.8-28.263 33-20.112 13.2 8.15 19.8 59.038 33 60.863 13.2 1.824 19.8-43.269 33-51.741s19.8 24.488 33 9.38c13.2-15.11 19.8-81.825 33-84.923s19.8 54.76 33 69.432 19.8 34.912 33 3.931 19.8-148.752 33-158.837c13.2-10.086 19.8 111.943 33 108.409 13.2-3.535 19.8-97.635 33-126.082s19.8-7.562 33-16.152 26.4-21.438 33-26.798"
                        fill="none"
                        className={'dark:stroke-sky-400 stroke-purple-500'}
                        strokeWidth="4"
                    />
                </svg>
            </div>
        </div>
    );
};
const SkeletonOne = () => {
    const variants = {
        initial: {
            width: 0,
        },
        animate: {
            width: "100%",
            transition: {
                duration: 0.2,
            },
        },
        hover: {
            width: ["0%", "100%"],
            transition: {
                duration: 2,
            },
        },
    };
    const arr = new Array(6).fill(0);
    return (
        <motion.div
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
        >
            {arr.map((_, i) => (
                <motion.div
                    key={"skelenton-two" + i}
                    variants={variants}
                    style={{
                        maxWidth: 100 + "%",
                    }}
                    className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4"
                ></motion.div>
            ))}
        </motion.div>
    );
};
const SkeletonThree = () => {
    const variants = {
        initial: {
            backgroundPosition: "0 50%",
        },
        animate: {
            backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
        },
    };
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={variants}
            transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
            }}
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
            style={{
                background:
                    "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
                backgroundSize: "400% 400%",
            }}
        >
            <motion.div className="h-full w-full rounded-lg"></motion.div>
        </motion.div>
    );
};
const SkeletonFour = () => {
    const first = {
        initial: {
            x: 20,
            rotate: -5,
        },
        hover: {
            x: 0,
            rotate: 0,
        },
    };
    const second = {
        initial: {
            x: -20,
            rotate: 5,
        },
        hover: {
            x: 0,
            rotate: 0,
        },
    };
    return (
        <motion.div
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
        >
            <motion.div
                variants={first}
                className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
            >
                <Image
                    src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
                    alt="avatar"
                    height="100"
                    width="100"
                    className="rounded-full h-10 w-10"
                />
                <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
                    John Doe
                </p>
                <p className="sm:text-sm text-xs text-center text-neutral-700">
                    john.doe@example.com
                </p>
                <p className="flex items-center gap-2 border border-blue-500 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-xs rounded-full px-2 py-0.5 mt-4">
                    <Shield size={16} className="text-blue-600"/>
                    Admin
                </p>
            </motion.div>
            <motion.div
                className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
                <Image
                    src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
                    alt="avatar"
                    height="100"
                    width="100"
                    className="rounded-full h-10 w-10"
                />
                <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
                    John Doe
                </p>
                <p className="sm:text-sm text-xs text-center text-neutral-700">
                    john.doe@example.com
                </p>
                <p className="flex items-center gap-2 border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
                    <Edit size={16} className="text-green-600"/>
                    Editor
                </p>
            </motion.div>
            <motion.div
                variants={second}
                className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
            >
                <Image
                    src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
                    alt="avatar"
                    height="100"
                    width="100"
                    className="rounded-full h-10 w-10"
                />
                <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
                    John Doe
                </p>
                <p className="sm:text-sm text-xs text-center text-neutral-700">
                    john.doe@example.com
                </p>
                <p className="flex items-center gap-2 border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
                    <Eye size={16} className="text-orange-600"/>
                    Viewer
                </p>
            </motion.div>
        </motion.div>
    );
};
const SkeletonFive = () => {
    const variants = {
        initial: {
            x: 0,
        },
        animate: {
            x: 10,
            rotate: 5,
            transition: {
                duration: 0.2,
            },
        },
    };
    const variantsSecond = {
        initial: {
            x: 0,
        },
        animate: {
            x: -10,
            rotate: -5,
            transition: {
                duration: 0.2,
            },
        },
    };
    const words = ["Maths", "Philosophy", "Physics", "Chemistry"];

    return (
        <motion.div
            initial="initial"
            whileHover="animate"
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
        >
            <motion.div
                variants={variants}
                className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black"
            >
                <Image
                    src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
                    alt="avatar"
                    height="100"
                    width="100"
                    className="rounded-full h-10 w-10"
                />
                <div className="text-xs">
                    I want to attend<FlipWords words={words} /> <br/>
                    classes.
                </div>
            </motion.div>
            <motion.div
                variants={variantsSecond}
                className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
            >
                <p className="text-xs">Ok, no problem.</p>
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0"/>
            </motion.div>
        </motion.div>
    );
};
const items = [
    {
        title: "Student Records",
        description: (
            <span className="text-sm">
            View and manage detailed information about enrolled students, including courses and groups.
        </span>
        ),
        header: <SkeletonOne/>,
        className: "md:col-span-1",
        icon: <Columns/>,
        link: "/dashboard/students"
    },
    {
        title: "Attendance Records",
        description: (
            <span className="text-sm">
            Track and manage student attendance for each course and group.
        </span>
        ),
        header: <SkeletonTwo/>,
        className: "md:col-span-1",
        icon: <ClipboardCheck/>,
        link: "#"
    },
    {
        title: "Grading System",
        description: (
            <span className="text-sm">
            Efficiently manage and update grades for students across all subjects.
        </span>
        ),
        header: <SkeletonThree/>,
        className: "md:col-span-1",
        icon: <Award/>,
        link: "#"
    },
    {
        title: "User Management",
        description: (
            <span className="text-sm">
            Manage and monitor user roles, permissions, and account details efficiently.
        </span>
        ),
        header: <SkeletonFour />,
        className: "md:col-span-2",
        icon: <Shield />,
        link: "/dashboard/users"
    },

    {
        title: "Course Enrollments",
        description: (
            <span className="text-sm">
            View and update student course enrollments for the academic year.
        </span>
        ),
        header: <SkeletonFive/>,
        className: "md:col-span-1",
        icon: <BookOpen/>,
        link: "#"
    },
];

// 1. 从故事数据中提取所有标题
const stories = storyData.map(story => story.title);

// 2. 检查当前页面是否存在目录入口
const observeEntry = document.querySelector("#observe-entry");

if (observeEntry) {

    // 找到九篇故事的链接
    const storyLinks = document.querySelectorAll("[data-story]");

    // 读取已经观测过的故事和后记
    const observedStories = JSON.parse(
        localStorage.getItem("observedStories")
    ) || [];

    // 给已经观测过的故事添加视觉标记
storyLinks.forEach(link => {

    const storyTitle = link.dataset.story;

    if (observedStories.includes(storyTitle)) {
        link.classList.add("story-observed");
    }

});

    // 判断九篇故事是否全部观测完成
    const allObserved = stories.every(
        story => observedStories.includes(story)
    );
// 获取后记入口
const afterwordEntry = document.querySelector("#afterword-entry");

// 读取后记的观测记录
const observedAfterword =
    localStorage.getItem("observedAfterword") === "true";

// 如果九篇故事全部观测完成，就显示后记
if (allObserved && afterwordEntry) {
    afterwordEntry.hidden = false;
}

// 如果后记已经被观测过，就添加灰色和倾斜样式
if (observedAfterword && afterwordEntry) {
    afterwordEntry.classList.add("story-observed");
}
    // 3. 根据观测进度改变目录状态
    if (allObserved) {

        // 全部观测完成：修改入口文字
        observeEntry.textContent = "开始新一轮观测";

        // 解锁九篇故事的直接访问
        storyLinks.forEach(link => {

            link.addEventListener("click", function(event) {

                event.preventDefault();

                const selectedStory = link.dataset.story;

                window.location.href =
                    "story.html?story=" + encodeURIComponent(selectedStory);

            });

        });

    } else {
        // 尚未解锁：禁止直接点击故事标题
        storyLinks.forEach(link => {

            link.addEventListener("click", function(event) {
                event.preventDefault();
            });

        });
        // 尚未全部观测：点击入口随机进入未观测的故事
        observeEntry.addEventListener("click", function(event) {

            event.preventDefault();

            const unobservedStories = stories.filter(
                story => !observedStories.includes(story)
            );

            const randomIndex = Math.floor(
                Math.random() * unobservedStories.length
            );

            const selectedStory = unobservedStories[randomIndex];

            window.location.href =
                "story.html?story=" + encodeURIComponent(selectedStory);

        });

    }

    // 4. 点击重新开始观测
    if (allObserved) {

        observeEntry.addEventListener("click", function(event) {

            event.preventDefault();

            // 清除之前的观测记录
            localStorage.removeItem("observedStories");

            // 重新随机进入一篇故事
            const randomIndex = Math.floor(
                Math.random() * stories.length
            );

            const selectedStory = stories[randomIndex];

            window.location.href =
                "story.html?story=" + encodeURIComponent(selectedStory);

        });

    }

}


 // 4. 检查当前页面是否存在故事标题元素
const titleElement = document.querySelector("#story-title");

if (titleElement) {

    // 获取 URL 中传递的故事标题
    const params = new URLSearchParams(window.location.search);
    const selectedTitle = params.get("story");

    // 检查标题是否属于我们的九篇故事
    if (stories.includes(selectedTitle)) {

        // 在页面上显示故事标题
        titleElement.textContent = selectedTitle;
        // 找到正文容器
        const contentElement = document.querySelector("#story-content");

        // 根据标题查找对应的故事对象
        const selectedStory = storyData.find(
        story => story.title === selectedTitle
        );

// 显示故事正文
if (contentElement && selectedStory) {
    contentElement.textContent = selectedStory.content;
}
        // 读取之前保存的观测记录
        let observedStories = JSON.parse(
            localStorage.getItem("observedStories")
        ) || [];

        // 如果当前故事还没有被观测过，就加入记录
        if (!observedStories.includes(selectedTitle)) {
            observedStories.push(selectedTitle);
        }

        // 将更新后的记录保存到浏览器
        localStorage.setItem(
            "observedStories",
            JSON.stringify(observedStories)
        );

    } else {
        titleElement.textContent = "未找到这篇故事";
    }

}

 // 5. 找到故事页面中的「继续观测」入口
const continueEntry = document.querySelector("#continue-entry");

if (continueEntry) {

    continueEntry.addEventListener("click", function(event) {

        // 阻止链接原本的跳转行为
        event.preventDefault();

        // 读取当前观测记录
        const observedStories = JSON.parse(
            localStorage.getItem("observedStories")
        ) || [];

        // 检查是否已经观测完全部故事
        const allObserved = stories.every(
            story => observedStories.includes(story)
        );

        // 如果全部观测完成，返回目录
        if (allObserved) {
            window.location.href = "index.html";
            return;
        }

        // 筛选尚未观测的故事
        const unobservedStories = stories.filter(
            story => !observedStories.includes(story)
        );

        // 随机选择下一篇未观测的故事
        const randomIndex = Math.floor(
            Math.random() * unobservedStories.length
        );

        const selectedStory = unobservedStories[randomIndex];

        // 进入下一篇故事
        window.location.href =
            "story.html?story=" + encodeURIComponent(selectedStory);

    });

}

// 检查当前是否为后记页面
const isAfterwordPage =
    window.location.pathname.endsWith("afterword.html");

if (isAfterwordPage) {

    // 读取九篇故事的观测记录
    const observedStories = JSON.parse(
        localStorage.getItem("observedStories")
    ) || [];

    // 检查九篇故事是否全部完成
    const allObserved = stories.every(
        story => observedStories.includes(story)
    );

    // 如果还没有完成九篇故事，不允许进入后记
    if (!allObserved) {
        window.location.href = "index.html";

    } else {
        // 记录后记已经被观测
        localStorage.setItem("observedAfterword", "true");
    }

}
import React, { Fragment, useEffect, useState } from "react";
import classes from "./CustomerReview.module.css";
import { createSearchParams, NavLink, useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAllDishRanking, fetchDishRanking, fetchDishRankingAnalysis } from "../../apis/raking.api";
import Pagination from "../Pagination/Pagination";
import useQueryParams from "../../hooks/useQueryParams";
import LoadingIndicator from "../UI/LoadingIndicator";
import omit from "lodash/omit";
import LoadingModal from "../LoadingModal/LoadingModal";
export default function CustomerReview({ dishId }) {
  const [activeButton, setActiveButton] = useState(null);
  const buttonLabels = ["All", "5 stars", "4 stars", "3 stars", "2 stars", "1 star"];

  const queryParams = useQueryParams();
  const navigate = useNavigate();
  console.log("Nannn", Boolean(NaN));

  const rankingQuery = useQuery({
    queryKey: ["commentList", { dishId, queryParams }],
    queryFn: () => fetchDishRanking(dishId, queryParams),
    enabled: !!queryParams?.rankingStars,
  });

  const rankingFetchAllQuery = useQuery({
    queryKey: ["commentList", queryParams],
    queryFn: () => fetchAllDishRanking(dishId, queryParams),
  });

  const rankingAnalysisQuery = useQuery({
    queryKey: ["rankingAnalysis", dishId],
    queryFn: () => fetchDishRankingAnalysis(dishId),
  });

  const data = rankingAnalysisQuery?.data?.data?.data;

  useEffect(() => {
    if (queryParams?.rankingStars) {
      setActiveButton(6 - queryParams.rankingStars);
    } else {
      setActiveButton(0);
    }
  }, [queryParams?.rankingStars]);

  let commentList = [];
  let totalPage = 0;
  if (rankingFetchAllQuery.data && !queryParams.rankingStars) {
    commentList = rankingFetchAllQuery.data.data.data.pageContent;
    totalPage = rankingFetchAllQuery.data.data.data.totalPages;
  }

  if (rankingQuery.data && queryParams.rankingStars) {
    commentList = rankingQuery.data.data.data.pageContent;
    totalPage = rankingQuery.data.data.data.totalPages;
  }

  const handleButtonClick = (index) => {
    setActiveButton(index);
    // Lấy index hoặc id hoặc tên của kind(5 stars chẳng hạn) , sau đó gửi api đến server lấy về data review thuộc kind này, lưu vào state để render ra giao diện, hoặc thử lưu vào biến data nào đó rồi render ra giao diện được không ?, vì state hiện tại đã có activeButton re-render lại giúp mình rồi
    if (index === 0) {
      navigate(`/food/${dishId}`);
    } else {
      navigate({
        pathname: `/food/${dishId}`,
        search: createSearchParams(
          omit(
            {
              ...queryParams,
              rankingStars: Number(6 - index),
            },
            ["pageNo"],
          ),
        ).toString(),
      });
    }
  };

  const currentPath = `/food/${dishId}`;

  return (
    <div className={`${classes.customerReview}`}>
      {/* {rankingAnalysisQuery.isLoading && <LoadingModal />} */}
      <h1 className={`${classes["cr-title"]}`}>CUSTOMER REVIEWS</h1>
      <div className={`${classes["customerReview-container"]}`}>
        <div className={`${["customerReview-content"]} row p-md-5 ps-md-2 align-items-center`}>
          {/* <div className={`col-md-3 col-12 ${classes["content-item"]} text-md-center pe-0`}>
            <p className={`${classes["rv-number"]}`}>
              <span>{data?.rankingAvg === 0 ? 0 : data?.rankingAvg.toFixed(1) || 0}</span>
              <span> / 5</span>
            </p>
            <p className="star">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
            </p>
            <p className="rv-vote">Base on 1 reviews</p>
          </div> */}
          <div className={`col-md-3 col-12 ${classes["content-item"]} text-md-center pe-0`}>
            <p className={`${classes["rv-number"]}`}>
              <span>{data?.rankingAvg === "NaN" || data?.rankingAvg === 0 ? 0 : data?.rankingAvg.toFixed(1) || 0}</span>
              <span> / 5</span>
            </p>
            <p className="star">
              {Array.from({ length: 5 }, (_, i) => {
                const fullStars = Math.floor(data?.rankingAvg); // Số sao đầy đủ
                const partialStar = data?.rankingAvg - fullStars; // Tỷ lệ sao còn lại (0 <= partialStar < 1)

                if (i < fullStars) {
                  // Hiển thị các sao đầy đủ màu vàng
                  return <i key={i} className="fa fa-star bold-yellow"></i>;
                } else if (i === fullStars && partialStar > 0) {
                  // Hiển thị sao một phần dựa trên tỷ lệ partialStar
                  return (
                    <span key={i} className="fa fa-star partial-star">
                      <span
                        style={{
                          width: `${partialStar * 100}%`,
                          overflow: "hidden",
                          display: "inline-block",
                        }}
                      >
                        <i className="fa fa-star bold-yellow"></i>
                      </span>
                    </span>
                  );
                } else {
                  // Hiển thị các sao nhạt màu
                  return <i key={i} className="fa fa-star gray-star"></i>;
                }
              })}
            </p>

            <p className="rv-vote">Base on {data?.rankingCount} reviews</p>
          </div>
          <div
            className={`col-md col-12 ${classes["content-item"]} ${classes["content-item-2"]} rv-rating-chart px-md-3`}
          >
            <div className={`${classes["rv-rating-row"]}`}>
              <span className={`${classes["rv-rating-star"]}`}>
                5<span>★</span>
              </span>
              <div className={`${classes["rv-progress-bar"]}`}>
                <div
                  className={`${classes["rv-progress"]}`}
                  //   style={{ width: percent ? `${percent}%` : "0" }}
                  style={{ width: `${data?.rank5 || 0}%` }}
                ></div>
              </div>
              <span className={`${classes["percent"]}`}>
                {data?.rank5 === "NaN" || data?.rank5 === 0
                  ? 0
                  : Number.isInteger(data?.rank5)
                    ? `${data?.rank5}%`
                    : `${data?.rank5.toFixed(2)}%`}
              </span>
            </div>
            <div className={`${classes["rv-rating-row"]}`}>
              <span className={`${classes["rv-rating-star"]}`}>
                4<span>★</span>
              </span>
              <div className={`${classes["rv-progress-bar"]}`}>
                <div
                  className={`${classes["rv-progress"]}`}
                  //   style={{ width: percent ? `${percent}%` : "0" }}
                  style={{ width: `${data?.rank4 || 0}%` }}
                ></div>
              </div>
              <span className={`${classes["percent"]}`}>
                {data?.rank4 === "NaN" || data?.rank4 === 0
                  ? 0
                  : Number.isInteger(data?.rank4)
                    ? `${data?.rank4}%`
                    : `${data?.rank4.toFixed(2)}%`}
              </span>
            </div>
            <div className={`${classes["rv-rating-row"]}`}>
              <span className={`${classes["rv-rating-star"]}`}>
                3<span>★</span>
              </span>
              <div className={`${classes["rv-progress-bar"]}`}>
                <div
                  className={`${classes["rv-progress"]}`}
                  //   style={{ width: percent ? `${percent}%` : "0" }}
                  style={{ width: `${data?.rank3 || 0}%` }}
                ></div>
              </div>
              <span className={`${classes["percent"]}`}>
                {data?.rank3 === "NaN" || data?.rank3 === 0
                  ? 0
                  : Number.isInteger(data?.rank3)
                    ? `${data?.rank3}%`
                    : `${data?.rank3.toFixed(2)}%`}
              </span>
            </div>
            <div className={`${classes["rv-rating-row"]}`}>
              <span className={`${classes["rv-rating-star"]}`}>
                2<span>★</span>
              </span>
              <div className={`${classes["rv-progress-bar"]}`}>
                <div
                  className={`${classes["rv-progress"]}`}
                  //   style={{ width: percent ? `${percent}%` : "0" }}
                  style={{ width: `${data?.rank2 || 0}%` }}
                ></div>
              </div>
              <span className={`${classes["percent"]}`}>
                {data?.rank2 === "NaN" || data?.rank2 === 0
                  ? 0
                  : Number.isInteger(data?.rank2)
                    ? `${data?.rank2}%`
                    : `${data?.rank2.toFixed(2)}%`}
              </span>
            </div>
            <div className={`${classes["rv-rating-row"]}`}>
              <span className={`${classes["rv-rating-star"]}`}>
                1<span>★</span>
              </span>
              <div className={`${classes["rv-progress-bar"]}`}>
                <div
                  className={`${classes["rv-progress"]}`}
                  //   style={{ width: percent ? `${percent}%` : "0" }}
                  style={{ width: `${data?.rank1 || 0}%` }}
                ></div>
              </div>
              <span className={`${classes["percent"]}`}>
                {data?.rank1 === "NaN" || data?.rank1 === 0
                  ? 0
                  : Number.isInteger(data?.rank1)
                    ? `${data?.rank1}%`
                    : `${data?.rank1.toFixed(2)}%`}
              </span>
            </div>
          </div>
          <div className={`col-md col-12 ${classes["content-item-last"]}`}>
            <p className="mb-md-0 mb-3">Filter by</p>
            <div className={classes.kind}>
              {buttonLabels.map((buttonLabel, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(index)}
                  className={`${activeButton === index ? classes.active : ""}`}
                >
                  {buttonLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {rankingQuery.isLoading || rankingFetchAllQuery.isLoading || rankingAnalysisQuery.isLoading ? (
        <LoadingIndicator />
      ) : (
        <Fragment>
          <div className={`${classes["customerRv-feedback"]}`}>
            <ul className="flex-column flex gap-3">
              {commentList.map((feedback, index) => (
                <li className="row border-bottom pb-3 last:!border-b-0" key={feedback.rankingId}>
                  <div className={`${classes.avatar} col-md-1 col-2`}>
                    <img
                      src={feedback.user.imageUrl || "default-avatar-url.jpg"}
                      alt={`${feedback.user.firstName} ${feedback.user.lastName}`}
                    />
                  </div>
                  <div className={`col-md-11 col-10 ${classes["feedback-content"]}`}>
                    <h3>{`${feedback.user.firstName} ${feedback.user.lastName}`}</h3>
                    <span className="star my-1 inline-block">
                      {Array.from({ length: feedback.rankingStars }).map((_, index) => (
                        <i key={index} className="fa fa-star"></i>
                      ))}
                    </span>
                    <p>{feedback.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Pagination totalPages={totalPage} queryParams={queryParams} pathname={currentPath} />
        </Fragment>
      )}

      {/* <UserOrderList orderList={orderList} loadingOrderList={orderListQuery.isFetching} /> */}
    </div>
  );
}

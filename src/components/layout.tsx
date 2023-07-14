// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { default as NXTImage } from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { App } from "../app/constants";
import { getApp, setApp } from "../features/app/app_slice";
import {
  getPolygonCategoryList,
  useGetCategoryListQuery,
  useGetFeaturedDappsQuery,
} from "../features/dapp/dapp_api";
import { AppStrings } from "../pages/constants";
import { FeaturedCard, SliderButton } from "./card";
import { Button, Card } from "./index";
import { Row } from "./layout/flex";
import aa from "../data/aa.json";
import dynamic from "next/dynamic";
import ScrollToTopButton from "./scroll_to_top";
import { openTransak } from "../utils/transak";
import { useWeb3AuthContext } from "../contexts/SocialLoginContext";
import { useSmartAccountContext } from "../contexts/SmartAccountContext";

function NavBar(props) {
  const DynamicConnect = dynamic(
    () => import("./connect").then((res) => res.default),
    {
      ssr: false,
    }
  );
  const app = useSelector(getApp);

  const dispatch = useDispatch();
  const router = useRouter();
  const onAppConfigClick = (app) => {
    dispatch(setApp(app));
    router.push("/");
  };
  const isActive = (config) => {
    if (app.title === config.title) {
      return "text-[#fff]";
    }
    return "";
  };
  return (
    <Row
      center
      className="border-b border-b-[#141217] bg-canvas-color px-4 py-2 md:py-4 md:px-10 gap-[16px]"
    >
      <div className="flex-initial">
        <NavItem href="/" className="pr-[20px]">
          <NXTImage
            width={App.logo.width}
            height={App.logo.height}
            src={App.logo.src}
            style={{ objectFit: "contain", height: App.logo.height }}
            alt={`${App.name} Logo`}
          />
        </NavItem>
      </div>
      <DynamicConnect />
    </Row>
  );
}

function NavItem(props) {
  return (
    <Link
      href={props.href}
      className={
        "flex-initial py-4 text-[14px] text-[#67666E] hover:text-[#fff] font-[600]" +
        props.className
      }
    >
      {props.children}
    </Link>
  );
}

function ExpansionPanel(props) {
  const { open, onClick, category } = props;
  // const [isExpanded, setExpanded] = useState<boolean>(open);
  const isExpanded = open;
  const hasSubCategories = props.category.subCategory.length > 0;
  // console.log(open)
  return (
    <div onClick={() => onClick(category.category)} className="pr-4">
      <div className="flex items-center justify-between">
        <Link href={`/categories/?categories=${category.category}`}>
          <p className="text-[20px] py-[10px] capitalize">
            {category.category}
          </p>
        </Link>
        {hasSubCategories && (
          <div className={isExpanded ? "rotate-180" : ""}>
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9.5L12 15.5L18 9.5"
                stroke="#E2E1E6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {open &&
        hasSubCategories &&
        category.subCategory.map((e) => (
          <div className="pl-5">
            <Link
              href={`/categories/?categories=${category.category}&subCategory=${e}`}
            >
              <p className="text-[16px] text-[#87868C] font-[500] py-[10px] hover:text-[#fff] capitalize">
                {e}
              </p>
            </Link>
          </div>
        ))}
    </div>
  );
}

function CategoryList(props) {
  // const chainId = useSelector(getApp).chainId;
  const data = getPolygonCategoryList();
  const [openKey, setOpenKey] = useState<string>("");
  // const {data, isLoading, isError} = useGetCategoryListQuery({chainId}, {
  //     refetchOnMountOrArgChange: false
  // });

  // if (isLoading) return <div className="mr-[16px]">
  //     <div className="shimmer w-full h-[48px] mb-[16px] rounded-lg"/>
  //     <div className="shimmer w-full h-[48px] mb-[16px] rounded-lg"/>
  //     <div className="shimmer w-full h-[48xp] mb-[16px] rounded-lg"/>
  //     <div className="shimmer w-full h-[48px] mb-[16px] rounded-lg"/>
  //     <div className="shimmer w-full h-[48px] mb-[16px] rounded-lg"/>
  //     <div className="shimmer w-full h-[48xp] mb-[16px] rounded-lg"/>
  // </div>
  // if (isError) return <p>Error</p>

  return (
    <ul>
      {data.data.map((e) => (
        <ExpansionPanel
          open={openKey === e.category}
          onClick={(value) =>
            openKey === e.category ? setOpenKey("") : setOpenKey(value)
          }
          category={e}
          key={e.category}
        />
      ))}
    </ul>
  );
}

//TOOD: RENAME
function Input(props) {
  const router = useRouter();
  const [value, setValue] = useState<string | Array<string>>(
    router.query.search || ""
  );

  useEffect(() => {
    if (value) {
      router.push(`/search?search=${value}`, undefined, { shallow: true });
      //  document.getElementById("searchBar")?.focus({ preventScroll: true});
    }
  }, [value]);

  return (
    <div className={props.className}>
      <div className="relative">
        <div className="absolute w-[20px] h-[20px] top-[12px] left-[12px] align-middle">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.0259 13.8475L18.595 17.4158L17.4159 18.595L13.8475 15.0258C12.5198 16.0902 10.8684 16.6691 9.16669 16.6667C5.02669 16.6667 1.66669 13.3067 1.66669 9.16666C1.66669 5.02666 5.02669 1.66666 9.16669 1.66666C13.3067 1.66666 16.6667 5.02666 16.6667 9.16666C16.6691 10.8683 16.0902 12.5198 15.0259 13.8475ZM13.3542 13.2292C14.4118 12.1416 15.0024 10.6837 15 9.16666C15 5.94333 12.3892 3.33333 9.16669 3.33333C5.94335 3.33333 3.33335 5.94333 3.33335 9.16666C3.33335 12.3892 5.94335 15 9.16669 15C10.6837 15.0024 12.1416 14.4118 13.2292 13.3542L13.3542 13.2292Z"
              fill="white"
            />
          </svg>
        </div>
        <input
          value={value}
          id="searchBar"
          onChange={(evt) => {
            setValue(evt.target.value);
          }}
          className="w-full p-2 pl-[48px] bg-canvas-color border border-border-color rounded-lg"
          type="search"
          placeholder={AppStrings.searchDapps}
        />
      </div>
    </div>
  );
}

export function Hero(props) {
  const { title, subtitle, video, button } = props;
  let [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useWeb3AuthContext();
  const { selectedAccount, getSmartAccountBalance }: any =
    useSmartAccountContext();
  console.log(selectedAccount?.smartAccountAddress, "smartAccountAddress");

  const buyCrypto = () => {
    return openTransak({
      email: userInfo.email,
      address: selectedAccount?.smartAccountAddress, //wallet?.address,
    });
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    (async () => {
      try {
        if (selectedAccount && selectedAccount.smartAccountAddress) {
          const balances = await getSmartAccountBalance();
          console.log(balances, "smartAccountBalance");
        }
      } catch (error) {
        alert(error);
      }
    })();
  }, [selectedAccount]);

  return (
    <>
      <div className="relative">
        <div
          className="bg-black bg-no-repeat bg-cover"
          style={{ backgroundImage: `url("/hero_bg.png")` }}
        >
          <Row className="min-h-[80vh] h-[80vh] justify-center flex-col-reverse md:flex-row md:justify-start items-center text-center md:text-left container z-10">
            <div className="flex-initial w-full md:w-1/2">
              <h1 className="text-[24px]  leading-[28px] md:text-[64px] md:leading-[72px] font-[500] mb-[24px]">
                {title}
              </h1>
              <p className="w-full md:w-[70%] text-[16px] text-[#67666E] leading-[24px] font-[500] mb-[24px]">
                {subtitle}
              </p>
              <Button>
                <a target={"_blank"} href={"https://app.meroku.org"}>
                  {button.text}
                </a>
              </Button>
              <Button className="ml-10" onClick={buyCrypto}>
                Buy Crypto
              </Button>
            </div>
          </Row>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent z-0 pointer-events-none" />
      </div>
    </>
  );
}

//for mobile view
function CategoryListSmall(props) {
  const router = useRouter();
  const data = getPolygonCategoryList();
  const currentCategory = router.query.categories as string | undefined;
  const [openKey, setOpenKey] = useState<string>(currentCategory ?? "");

  const [selected, setSelected] = useState<string>(
    (router.query.subCategory as string | undefined) || ""
  );

  return (
    <Row className="lg:hidden overflow-scroll gap-[16px] py-[32px]">
      {data.data.map((e, index) => (
        <details
          key={JSON.stringify(e)}
          onToggle={() => {
            setOpenKey(e.category);
          }}
        >
          <summary className="cursor-pointer bg-[#212026] rounded-[32px] flex justify-between items-center py-[8px] px-[12px]">
            <Link href={`/categories/?categories=${e.category}`}>
              <div className="capitalize whitespace-nowrap text-[14px] leading-[21px]">
                {e.subCategory.includes(selected) ? selected : e.category}
              </div>
            </Link>
            {e.subCategory.length > 0 ? (
              e.subCategory.includes(selected) ? (
                <svg
                  className="ml-[16px]"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    router.push(
                      `/categories/?categories=${data.data[0].category}`,
                      undefined,
                      { shallow: true }
                    );
                    setSelected("");
                    setOpenKey("");
                  }}
                >
                  <path
                    d="M1 1L11 11M11 1L1 11"
                    stroke="#E2E1E6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : openKey === e.category ? (
                <svg
                  className="ml-[16px]"
                  width="18"
                  height="18"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9.5L12 15.5L18 9.5"
                    stroke="#E2E1E6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="ml-[16px]"
                  width="18"
                  height="18"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9.5L12 15.5L18 9.5"
                    stroke="#E2E1E6"
                    stroke-width="2"
                    stroke-linecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )
            ) : (
              <></>
            )}
          </summary>
          {openKey === e.category && e.subCategory.length > 0 && (
            <div className="cursor-pointer mt-[16px] inset-0">
              <Card>
                {e.subCategory.map((f) => {
                  return (
                    <p
                      key={JSON.stringify(e)}
                      onClick={() => {
                        router.push(
                          `/categories/?categories=${
                            e.category
                          }&subCategory=${f.toString()}`,
                          undefined,
                          { shallow: true }
                        );
                        setSelected(f);
                        setOpenKey("");
                      }}
                      className="capitalize whitespace-nowrap py-[12px] text-[14px] leading-[21px]"
                    >
                      {f}
                    </p>
                  );
                })}
              </Card>
            </div>
          )}
        </details>
      ))}
    </Row>
  );
}

export function PageLayout(props) {
  const app = useSelector(getApp);
  const { data, isFetching, isLoading } = useGetCategoryListQuery(
    {
      chainId: app.chainId,
    },
    {
      refetchOnMountOrArgChange: false,
    }
  );
  let child;
  if (isLoading || isFetching) {
    child = (
      <div className="mr-[16px]">
        <div className="shimmer w-full h-[48px] mb-[16px] rounded-lg" />
        <div className="shimmer w-full h-[48px] mb-[16px] rounded-lg" />
        <div className="shimmer w-full h-[48px] mb-[16px] rounded-lg" />
        <div className="shimmer w-full h-[48px] mb-[16px] rounded-lg" />
      </div>
    );
  }
  // else if (!data.data) child= <h1>Error</h1>
  else {
    child = <CategoryList />;
  }
  return (
    <article className="container">
      <Row className="justify-between items-center py-8 md:border-b md:border-b-border-color flex-wrap lg:flex-nowrap gap-4">
        <div className="flex-initial w-full md:w-10/12">
          <span className="text-[20px] leading-[27px] lg:text-[42px] lg:leading-[48px] font-[500]">
            {app.title}
          </span>
        </div>
        <div className="flex-initial w-full md:w-3/12">
          <Input />
        </div>
      </Row>

      {data && <CategoryListSmall data={data} />}

      <Row className="items-start justify-start">
        <aside className="hidden lg:flex md:flex-initial w-3/12 border-r border-r-border-color">
          <div className="w-full">
            <div className="py-4 border-b border-b-border-color">
              <Link href="/history">
                <svg
                  className="inline-block mr-4"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 12.5C22 18.0228 17.5228 22.5 12 22.5M22 12.5C22 6.97715 17.5228 2.5 12 2.5M22 12.5H2M12 22.5C6.47715 22.5 2 18.0228 2 12.5M12 22.5C14.5013 19.7616 15.9228 16.208 16 12.5C15.9228 8.79203 14.5013 5.23835 12 2.5M12 22.5C9.49872 19.7616 8.07725 16.208 8 12.5C8.07725 8.79203 9.49872 5.23835 12 2.5M2 12.5C2 6.97715 6.47715 2.5 12 2.5"
                    stroke="#E2E1E6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="text-xl">{AppStrings.browsingHistory}</span>
              </Link>
            </div>
            <div className="py-4">
              <Link href="/">
                <span className="text-xl">{AppStrings.allDapps}</span>
              </Link>
            </div>
            {child}
          </div>
        </aside>
        <section className="flex-grow lg:w-9/12 lg:pl-8 md:pt-8">
          {props.children}
        </section>
      </Row>
    </article>
  );
}

export default function Layout(props) {
  const app = useSelector(getApp);
  const router = useRouter();
  const { data, isLoading } = useGetFeaturedDappsQuery();
  const slider = useRef();
  let dragging = false;

  const settings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    rows: 1,
    slidesToShow: 4.5,
    swipeToSlide: true,
    beforeChange: () => (dragging = true),
    afterChange: () => (dragging = false),
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2.15,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3.15,
        },
      },
    ],
  };

  function buildLoadingCard(number: number) {
    let output = Array<React.JSX.Element>();
    for (let i = 0; i < number; i++) {
      output.push(
        <div className="shimmer h-[240px] lg:h-[320px] mb-[16px] rounded-lg" />
      );
    }
    return output;
  }

  console.log({ aa: aa });

  return (
    <>
      <div {...props}>
        <div className="fixed h-[70px] w-full z-20">
          <NavBar />
        </div>
        <main className="relative top-[70px]">
          {router.asPath === "/" && (
            <section>
              <div className="min-h-[80vh]">
                <Hero
                  title={app.hero.title}
                  subtitle={app.hero.title}
                  button={app.hero.button}
                  video={app.hero.video}
                />
              </div>
              <div className="container relative">
                <Row className="justify-between items-center my-[32px]">
                  <h2 className="text-[24px] leading-[32px] lg:text-[60px] lg:leading-[72px] font-[500]">
                    {AppStrings.featuredDapps}
                  </h2>
                  <div>
                    <SliderButton
                      onClick={() => {
                        (slider?.current as any).slickPrev();
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 12L5 12M5 12L12 19M5 12L12 5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </SliderButton>
                    <SliderButton
                      onClick={() => {
                        (slider?.current as any).slickNext();
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </SliderButton>
                  </div>
                </Row>
                <Slider ref={slider} {...settings}>
                  {aa
                    ? aa.map((dapp) => (
                        <Link
                          key={app.dappId}
                          href={`/aa?id=${dapp.dappId}`}
                          draggable={false}
                          onClick={(e) => dragging && e.preventDefault()}
                        >
                          <FeaturedCard app={dapp} />
                        </Link>
                      ))
                    : buildLoadingCard(5)}
                </Slider>
              </div>
            </section>
          )}
          {props.children}
          <ScrollToTopButton />
        </main>
      </div>
    </>
  );
}

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Svg, {
  G,
  Path,
  Circle,
  Text as SvgText,
  Rect,
  Line,
} from "react-native-svg";

import MainHeader from "../components/MainHeader";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/Color_Icon";
import { RAW_TRANSACTIONS } from "../constants/MockData";

const { width } = Dimensions.get("window");

// --- CẤU HÌNH BIỂU ĐỒ ---
const CHART_HEIGHT = 200;
const BAR_WIDTH = 14;
const BAR_GAP = 5;
const PIE_RADIUS = width / 3.2;
const PIE_CENTER_X = width / 2;
const PIE_CENTER_Y = PIE_RADIUS + 20;

const TIME_UNITS = [
  { id: "12h", label: "12H" },
  { id: "1d", label: "Ngày" },
  { id: "1w", label: "Tuần" },
  { id: "1m", label: "Tháng" },
];

export default function Stats({ navigation }) {
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [selectedUnit, setSelectedUnit] = useState("1d");
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(null);

  const chartScrollViewRef = useRef(null);

  // --- 1. XỬ LÝ DỮ LIỆU BIỂU ĐỒ ---
  const chartData = useMemo(() => {
    setSelectedBarIndex(null);

    // Lọc theo loại (Thu/Chi)
    const filteredRaw = RAW_TRANSACTIONS.filter(
      (t) => t.type === transactionType
    );

    // Sắp xếp thời gian
    const sortedRaw = [...filteredRaw].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Nhóm dữ liệu
    const grouped = {};
    sortedRaw.forEach((item) => {
      const date = new Date(item.date);
      let key = "";
      let label = "";
      // Logic đơn giản hóa cho demo "Ngày"
      key = `${date.getDate()}/${date.getMonth() + 1}`;
      label = key;

      if (!grouped[key]) {
        grouped[key] = {
          label: label,
          day: date.getDate(), // Lưu ngày để check chia hết cho 5
          value: 0,
        };
      }
      grouped[key].value += item.amount;
    });

    return Object.values(grouped);
  }, [transactionType]); // Chỉ chạy lại khi đổi loại Thu/Chi

  // --- 2. TÍNH TOÁN CHIỀU RỘNG & ĐƯỜNG KẺ ---
  // Tính chiều rộng thực tế để ép ScrollView phải cuộn
  const chartContentWidth = Math.max(
    width,
    chartData.length * (BAR_WIDTH + BAR_GAP) + 60
  );

  const linePath = useMemo(() => {
    if (chartData.length < 2) return "";
    const maxVal = Math.max(...chartData.map((d) => d.value)) || 1;

    return chartData
      .map((item, index) => {
        const x = index * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
        const barHeight = (item.value / maxVal) * (CHART_HEIGHT - 40);

        // ĐẨY CAO ĐƯỜNG GẤP KHÚC:
        const y = CHART_HEIGHT - barHeight - 30;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [chartData]);

  // Tự động cuộn tới cuối
  useEffect(() => {
    if (chartScrollViewRef.current) {
      setTimeout(
        () => chartScrollViewRef.current.scrollToEnd({ animated: true }),
        100
      );
    }
  }, [chartData]);

  // --- Logic Pie Chart (Giữ nguyên) ---
  const categoryStats = useMemo(() => {
    const source =
      transactionType === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const filteredRaw = RAW_TRANSACTIONS.filter(
      (t) => t.type === transactionType
    );
    const catMap = {};
    filteredRaw.forEach((t) => {
      const randomCat = source[Math.floor(Math.random() * source.length)];
      const catName = randomCat.name;
      if (!catMap[catName]) catMap[catName] = { ...randomCat, amount: 0 };
      catMap[catName].amount += t.amount;
    });
    let data = Object.values(catMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    let currentAngle = 0;
    data = data.map((item) => {
      const percent = total === 0 ? 0 : item.amount / total;
      const angle = percent * 2 * Math.PI;
      const itemData = {
        ...item,
        percent,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
      };
      currentAngle += angle;
      return itemData;
    });
    return { data, total };
  }, [transactionType]);

  const createPieSlice = (startAngle, endAngle, radius) => {
    const x1 = PIE_CENTER_X + radius * Math.cos(startAngle);
    const y1 = PIE_CENTER_Y + radius * Math.sin(startAngle);
    const x2 = PIE_CENTER_X + radius * Math.cos(endAngle);
    const y2 = PIE_CENTER_Y + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${PIE_CENTER_X} ${PIE_CENTER_Y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };
  const formatCurrency = (amount) =>
    amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Màu sắc chủ đạo
  const THEME_COLOR = transactionType === "EXPENSE" ? "#F44336" : "#00C853";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <MainHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* SWITCHER */}
        <View style={styles.switchWrapper}>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchBtn,
                transactionType === "EXPENSE" && styles.switchBtnActive,
              ]}
              onPress={() => setTransactionType("EXPENSE")}
            >
              <Text
                style={[
                  styles.switchText,
                  transactionType === "EXPENSE" && { color: "#F44336" },
                ]}
              >
                Chi tiêu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchBtn,
                transactionType === "INCOME" && styles.switchBtnActive,
              ]}
              onPress={() => setTransactionType("INCOME")}
            >
              <Text
                style={[
                  styles.switchText,
                  transactionType === "INCOME" && { color: "#00C853" },
                ]}
              >
                Thu nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- BIỂU ĐỒ STOCK (CÓ KÉO NGANG) --- */}
        <TouchableWithoutFeedback onPress={() => setSelectedBarIndex(null)}>
          <View style={styles.cardContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.sectionTitle}>Biểu đồ xu hướng</Text>
              <View style={styles.unitSelector}>
                {TIME_UNITS.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.unitBtn,
                      selectedUnit === unit.id && styles.unitBtnActive,
                    ]}
                    onPress={() => setSelectedUnit(unit.id)}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        selectedUnit === unit.id && {
                          color: THEME_COLOR,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {unit.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={chartScrollViewRef}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {/* Set cứng width cho View bao ngoài SVG để đảm bảo scroll hoạt động */}
              <View style={{ height: CHART_HEIGHT, width: chartContentWidth }}>
                {/* LỚP 1: ĐƯỜNG KẺ (LINE CHART) */}
                <Svg
                  height={CHART_HEIGHT}
                  width={chartContentWidth}
                  style={StyleSheet.absoluteFill}
                >
                  <Path
                    d={linePath}
                    fill="none"
                    stroke={THEME_COLOR}
                    strokeWidth="2"
                    strokeOpacity="0.8"
                  />
                </Svg>

                {/* LỚP 2: CỘT (BAR CHART) */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    height: CHART_HEIGHT,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                  }}
                >
                  {chartData.map((item, idx) => {
                    const maxVal =
                      Math.max(...chartData.map((d) => d.value)) || 1;
                    // Tính height cột
                    const height = (item.value / maxVal) * (CHART_HEIGHT - 40);

                    const isSelected = selectedBarIndex === idx;
                    const isAnySelected = selectedBarIndex !== null;
                    const barColor =
                      isSelected || !isAnySelected ? THEME_COLOR : "#E0E0E0";
                    const barOpacity = isSelected
                      ? 1
                      : !isAnySelected
                      ? 0.5
                      : 0.3;

                    // --- LOGIC HIỂN THỊ NGÀY (Chia hết cho 5) ---
                    const showLabel = item.day % 5 === 0;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={{
                          alignItems: "center",
                          width: BAR_WIDTH,
                          marginLeft: idx === 0 ? 0 : BAR_GAP,
                        }}
                        activeOpacity={0.8}
                        onPress={() =>
                          setSelectedBarIndex(isSelected ? null : idx)
                        }
                      >
                        {/* Tooltip */}
                        {isSelected && (
                          <View
                            style={{
                              position: "absolute",
                              top: -height - 35,
                              backgroundColor: "#333",
                              padding: 3,
                              borderRadius: 4,
                              zIndex: 10,
                              minWidth: 50,
                            }}
                          >
                            <Text
                              style={{
                                color: "#FFF",
                                fontSize: 10,
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {formatCurrency(item.value / 1000)}k
                            </Text>
                          </View>
                        )}

                        <View
                          style={{
                            width: BAR_WIDTH,
                            height: height || 2,
                            backgroundColor: barColor,
                            opacity: barOpacity,
                            borderRadius: 2,
                            marginBottom: 5,
                          }}
                        />

                        {/* Chỉ hiện Label nếu ngày chia hết cho 5 */}
                        {showLabel ? (
                          <Text
                            style={{
                              fontSize: 9,
                              color: "#666",
                              textAlign: "center",
                              width: 40,
                              marginTop: 2,
                            }}
                          >
                            {item.label}
                          </Text>
                        ) : (
                          <View style={{ height: 13 }} /> // Placeholder để trục không bị lệch
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        {/* PIE CHART SECTION */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Phân tích danh mục</Text>
          <View style={styles.pieContainer}>
            <Svg width={width} height={PIE_RADIUS * 2 + 40}>
              <G>
                {categoryStats.data.map((slice, index) => {
                  const isSelected = selectedSliceIndex === index;
                  const radius = isSelected ? PIE_RADIUS + 10 : PIE_RADIUS;
                  return (
                    <Path
                      key={index}
                      d={createPieSlice(
                        slice.startAngle,
                        slice.endAngle,
                        radius
                      )}
                      fill={slice.color}
                      stroke="#FFF"
                      strokeWidth={2}
                      onPress={() =>
                        setSelectedSliceIndex(
                          index === selectedSliceIndex ? null : index
                        )
                      }
                    />
                  );
                })}
                <Circle
                  cx={PIE_CENTER_X}
                  cy={PIE_CENTER_Y}
                  r={PIE_RADIUS * 0.6}
                  fill="#FFF"
                />
                <SvgText
                  x={PIE_CENTER_X}
                  y={PIE_CENTER_Y - 5}
                  fill="#666"
                  fontSize="14"
                  fontFamily="Montserrat-Regular"
                  textAnchor="middle"
                >
                  {selectedSliceIndex !== null ? "Chi tiết" : "Tổng cộng"}
                </SvgText>
                <SvgText
                  x={PIE_CENTER_X}
                  y={PIE_CENTER_Y + 20}
                  fill="#333"
                  fontSize="18"
                  fontFamily="Montserrat-Bold"
                  textAnchor="middle"
                >
                  {selectedSliceIndex !== null
                    ? formatCurrency(
                        categoryStats.data[selectedSliceIndex].amount
                      )
                    : formatCurrency(categoryStats.total)}
                </SvgText>
              </G>
            </Svg>
          </View>

          <View style={styles.listContainer}>
            {categoryStats.data.map((item, index) => {
              const isSelected = selectedSliceIndex === index;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.rankItem, isSelected && styles.rankItemActive]}
                  onPress={() =>
                    setSelectedSliceIndex(
                      index === selectedSliceIndex ? null : index
                    )
                  }
                >
                  <View
                    style={[
                      styles.rankIconBox,
                      { backgroundColor: item.color + "20" },
                    ]}
                  >
                    <FontAwesome5
                      name={item.icon}
                      size={16}
                      color={item.color}
                    />
                  </View>
                  <View style={styles.rankContent}>
                    <View style={styles.rankRow}>
                      <Text
                        style={[
                          styles.rankName,
                          isSelected && { color: "#1F41BB" },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.rankAmount,
                          isSelected && { color: "#1F41BB" },
                        ]}
                      >
                        {formatCurrency(item.amount)} ₫
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${item.percent * 100}%`,
                            backgroundColor: item.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.percentText}>
                      {Math.round(item.percent * 100)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  topSection: { paddingHorizontal: 20, paddingTop: 10, marginBottom: 15 },
  screenTitle: { fontFamily: "Montserrat-Bold", fontSize: 20, color: "#333" },
  switchWrapper: { alignItems: "center", marginBottom: 20 },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    padding: 4,
    width: "90%",
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  switchBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  switchText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#999",
  },

  cardContainer: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontFamily: "Montserrat-Bold", fontSize: 16, color: "#333" },

  unitSelector: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 2,
  },
  unitBtn: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  unitBtnActive: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 1,
  },
  unitText: { fontSize: 10, fontFamily: "Montserrat-Medium", color: "#888" },
  unitTextActive: { fontFamily: "Montserrat-SemiBold", color: "#1F41BB" },

  pieContainer: { alignItems: "center", marginBottom: 20 },
  listContainer: { marginTop: 10 },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  rankItemActive: { backgroundColor: "#F0F4FF" },
  rankIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankContent: { flex: 1 },
  rankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rankName: { fontFamily: "Montserrat-SemiBold", fontSize: 13, color: "#333" },
  rankAmount: { fontFamily: "Montserrat-Bold", fontSize: 13, color: "#333" },
  progressBarBg: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    width: "100%",
    marginBottom: 2,
  },
  progressBarFill: { height: "100%", borderRadius: 2 },
  percentText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
    color: "#AAA",
    textAlign: "right",
  },
});

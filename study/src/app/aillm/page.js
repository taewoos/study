'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { RichTextEditor } from '../../components/RichTextEditor';

export default function AillmPage() {
  // Left panel state
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [leftPanelHeight, setLeftPanelHeight] = useState(800); // Default height, will be set on mount
  const [leftPanelPosition, setLeftPanelPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const [verticalResizeStart, setVerticalResizeStart] = useState({ y: 0, height: 0 });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Right panel state
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [rightPanelHeight, setRightPanelHeight] = useState(800);
  const [rightPanelPosition, setRightPanelPosition] = useState({ x: 0, y: 0 });
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [isResizingRightVertical, setIsResizingRightVertical] = useState(false);
  const [rightVerticalResizeStart, setRightVerticalResizeStart] = useState({ y: 0, height: 0 });
  const [isDraggingRightPanel, setIsDraggingRightPanel] = useState(false);
  const [rightDragStart, setRightDragStart] = useState({ x: 0, y: 0 });
  
  // Toolbar state
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const [toolbarDragStart, setToolbarDragStart] = useState({ x: 0, y: 0 });
  
  // Q&A Window state
  const [qaWindowPosition, setQaWindowPosition] = useState({ x: 0, y: 0 });
  const [qaWindowSize, setQaWindowSize] = useState({ width: 900, height: 600 });
  const [isDraggingQaWindow, setIsDraggingQaWindow] = useState(false);
  const [qaWindowDragStart, setQaWindowDragStart] = useState({ x: 0, y: 0 });
  
  // Input Container state
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [inputSize, setInputSize] = useState({ width: 900 });
  const [isDraggingInput, setIsDraggingInput] = useState(false);
  const [inputDragStart, setInputDragStart] = useState({ x: 0, y: 0 });

  // Drawing Area state
  const [drawingAreaPosition, setDrawingAreaPosition] = useState({ x: 0, y: 0 });
  const [isDraggingDrawingArea, setIsDraggingDrawingArea] = useState(false);
  const [drawingAreaDragStart, setDrawingAreaDragStart] = useState({ x: 0, y: 0 });

  // Canvas items state
  const [canvasItems, setCanvasItems] = useState([]);
  const [activeCanvasItemId, setActiveCanvasItemId] = useState(null);
  const [selectedCanvasItemIds, setSelectedCanvasItemIds] = useState([]);
  const [editingTextItemId, setEditingTextItemId] = useState(null);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [textModalTargetId, setTextModalTargetId] = useState(null); // 일반 텍스트/도형 대상
  const [textModalTableTarget, setTextModalTableTarget] = useState(null); // 표 셀 대상 { tableId, row, col }
  const [textModalContent, setTextModalContent] = useState('');
  const [defaultFillColor, setDefaultFillColor] = useState('#E8F4FD');
  const [defaultLineColor, setDefaultLineColor] = useState('#2f5f9e');
  const [defaultTextColor, setDefaultTextColor] = useState('#111111');
  const [defaultBorderColor, setDefaultBorderColor] = useState('#4A90E2');
  const [defaultStrokeWidth, setDefaultStrokeWidth] = useState(3);
  const [canvasGroups, setCanvasGroups] = useState([]);
  const [activeCanvasGroupId, setActiveCanvasGroupId] = useState(null);
  const [isDraggingCanvasItem, setIsDraggingCanvasItem] = useState(false);
  const [canvasItemDragStart, setCanvasItemDragStart] = useState({ x: 0, y: 0 });
  const [isResizingCanvasItem, setIsResizingCanvasItem] = useState(false);
  const [canvasResizeStart, setCanvasResizeStart] = useState({
    id: null,
    handle: 'se',
    mouseX: 0,
    mouseY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [showCanvasGrid, setShowCanvasGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [isLineMode, setIsLineMode] = useState(false);
  const [lineDraft, setLineDraft] = useState(null);
  const [canvasLinks, setCanvasLinks] = useState([]);
  const [activeCanvasLinkId, setActiveCanvasLinkId] = useState(null);
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState(null);
  const [linkDrag, setLinkDrag] = useState(null);
  const [lineDrag, setLineDrag] = useState(null);
  const [isSelectingCanvasItems, setIsSelectingCanvasItems] = useState(false);
  const [canvasSelectionRect, setCanvasSelectionRect] = useState(null);
  const [isGroupMode, setIsGroupMode] = useState(false);
  
  // Memo Pad Button state
  const [memoPadPosition, setMemoPadPosition] = useState({ x: 0, y: 0 });
  const [isDraggingMemoPad, setIsDraggingMemoPad] = useState(false);
  const [memoPadDragStart, setMemoPadDragStart] = useState({ x: 0, y: 0 });
  
  // Conversation list state
  const [conversations, setConversations] = useState([
    { id: 1, title: '대화목록1', lastMessage: '최근 메시지...' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  
  // Custom mode state
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [savedPositions, setSavedPositions] = useState({
    leftPanel: { x: 0, y: 0, width: 320, height: 800 },
    rightPanel: { x: 0, y: 0, width: 320, height: 800 },
    toolbar: { x: 0, y: 0 },
    qaWindow: { x: 0, y: 0, width: 900, height: 600 },
    input: { x: 0, y: 0, width: 900 },
    drawingArea: { x: 0, y: 0 },
    memoPad: { x: 0, y: 0 },
    windowSize: { width: 1920, height: 1080 } // 저장 시점의 창 크기
  });
  // 커스텀 모드 시작 시점의 위치 저장 (취소용)
  const [customModeStartPositions, setCustomModeStartPositions] = useState(null);
  
  // Memo state
  const [memos, setMemos] = useState([]);
  const [draggingMemo, setDraggingMemo] = useState(null);
  const [memoDragStart, setMemoDragStart] = useState({ x: 0, y: 0 });

  const CHAT_BOUNDARY_OFFSET = 0;

  // Template modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([]);
  // Table modal state
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [editingTableId, setEditingTableId] = useState(null);
  const [activeTableCell, setActiveTableCell] = useState(null); // { tableId, row, col }
  
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const toolbarRef = useRef(null);
  const qaWindowRef = useRef(null);
  const inputContainerRef = useRef(null);
  const memoPadRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const canvasFileInputRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const verticalResizeHandleRef = useRef(null);
  const rightResizeHandleRef = useRef(null);
  const rightVerticalResizeHandleRef = useRef(null);

  // Set initial height on client mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const height = window.innerHeight;
    setLeftPanelHeight(height);
    setRightPanelHeight(height);
    let initialWindowSize = { width: window.innerWidth, height: window.innerHeight };
    
    // Load saved positions from localStorage
    const saved = localStorage.getItem('aillmPositions');
    if (saved) {
      try {
        const positions = JSON.parse(saved);
        // windowSize가 없으면 현재 창 크기로 설정 (기존 저장 데이터 호환성)
        if (!positions.windowSize) {
          positions.windowSize = {
            width: typeof window !== 'undefined' ? window.innerWidth : 1920,
            height: typeof window !== 'undefined' ? window.innerHeight : 1080
          };
        }
        // 기존 저장 데이터 호환성: qaWindow와 input에 width/height가 없으면 기본값 설정
        if (!positions.qaWindow.width) positions.qaWindow.width = 900;
        if (!positions.qaWindow.height) positions.qaWindow.height = 600;
        if (!positions.input.width) positions.input.width = 900;
        initialWindowSize = positions.windowSize || initialWindowSize;
        const { width: memoPadWidth } = getMemoPadDimensions();
        if (positions.memoPad && !positions.memoPad.anchor) {
          positions.memoPad = {
            x: positions.memoPad.x + (positions.windowSize.width - memoPadWidth - 20),
            y: positions.memoPad.y + 20,
            anchor: 'left'
          };
        }
        if (!positions.memoPad) {
          positions.memoPad = {
            x: positions.windowSize.width - memoPadWidth - 20,
            y: 20,
            anchor: 'left'
          };
        }
        applyPositions(positions);
        // 초기 로드는 저장된 위치 그대로 사용 (useEffect에서 비율 계산 적용)
        applyPositions(positions);
      } catch (e) {
        console.error('Failed to load saved positions:', e);
      }
    } else {
      const { width: memoPadWidth } = getMemoPadDimensions();
      const defaultMemoPadPosition = {
        x: window.innerWidth - memoPadWidth - 20,
        y: 20
      };
      setMemoPadPosition(defaultMemoPadPosition);
      setSavedPositions((prev) => ({
        ...prev,
        memoPad: { ...defaultMemoPadPosition, anchor: 'left' },
        windowSize: initialWindowSize
      }));
    }
    
    // Load saved memos from localStorage
    const savedMemos = localStorage.getItem('aillmMemos');
    if (savedMemos) {
      try {
        const parsedMemos = JSON.parse(savedMemos);
        if (parsedMemos && parsedMemos.length > 0) {
          const normalizedMemos = parsedMemos.map((memo) => ({
            ...memo,
            basePosition: memo.basePosition || memo.position,
            baseSize: memo.baseSize || memo.size,
            baseWindowSize: memo.baseWindowSize || initialWindowSize
          }));
          setMemos(normalizedMemos);
        }
      } catch (e) {
        console.error('Failed to load saved memos:', e);
      }
    }
  }, []);
  
  // Save memos to localStorage whenever they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aillmMemos', JSON.stringify(memos));
    }
  }, [memos, isMounted]);

  // Load saved canvas items from localStorage
  useEffect(() => {
    if (!isMounted) return;
    const savedCanvas = localStorage.getItem('aillmCanvasItems');
    if (savedCanvas) {
      try {
        const parsed = JSON.parse(savedCanvas);
        if (Array.isArray(parsed)) {
          setCanvasItems(parsed);
        }
      } catch (e) {
        console.error('Failed to load canvas items:', e);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const savedLinks = localStorage.getItem('aillmCanvasLinks');
    if (savedLinks) {
      try {
        const parsed = JSON.parse(savedLinks);
        if (Array.isArray(parsed)) {
          setCanvasLinks(parsed);
        }
      } catch (e) {
        console.error('Failed to load canvas links:', e);
      }
    }
  }, [isMounted]);

  // Save canvas items to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aillmCanvasItems', JSON.stringify(canvasItems));
    }
  }, [canvasItems, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aillmCanvasLinks', JSON.stringify(canvasLinks));
    }
  }, [canvasLinks, isMounted]);

  // Load / Save canvas groups to localStorage
  useEffect(() => {
    if (!isMounted) return;
    const savedGroups = localStorage.getItem('aillmCanvasGroups');
    if (savedGroups) {
      try {
        const parsed = JSON.parse(savedGroups);
        if (Array.isArray(parsed)) {
          setCanvasGroups(parsed);
        }
      } catch (e) {
        console.error('Failed to load canvas groups:', e);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aillmCanvasGroups', JSON.stringify(canvasGroups));
    }
  }, [canvasGroups, isMounted]);

  // Load saved templates from localStorage
  useEffect(() => {
    if (!isMounted) return;
    const savedTemplatesRaw = localStorage.getItem('aillmTemplates');
    if (savedTemplatesRaw) {
      try {
        const parsedTemplates = JSON.parse(savedTemplatesRaw);
        if (Array.isArray(parsedTemplates)) {
          setSavedTemplates(parsedTemplates);
        }
      } catch (e) {
        console.error('Failed to load saved templates:', e);
      }
    }
  }, [isMounted]);

  // Calculate responsive positions based on saved window size (with rounding for clean values)
  const getResponsivePosition = (savedPos, savedWindowSize, isCentered = false, leftPanelWidth = 0, savedLeftPanelWidth = 0) => {
    if (!savedWindowSize || !isMounted) return savedPos;
    
    const currentWidth = typeof window !== 'undefined' ? window.innerWidth : savedWindowSize.width;
    const currentHeight = typeof window !== 'undefined' ? window.innerHeight : savedWindowSize.height;
    
    const scaleX = currentWidth / savedWindowSize.width;
    const scaleY = currentHeight / savedWindowSize.height;
    
    // 중앙 정렬된 요소의 경우, 중앙 기준점 변화와 왼쪽 패널 너비 변화도 고려
    let adjustedX = savedPos.x * scaleX;
    let adjustedY = savedPos.y * scaleY;
    
    // 중앙 정렬된 요소는 더 왼쪽으로 이동하도록 조정
    if (isCentered) {
      // 왼쪽 패널 너비 변화량 계산 (패널이 작아지면 QA 창이 더 왼쪽으로 이동 가능)
      const leftPanelWidthDiff = (savedLeftPanelWidth - leftPanelWidth) * 0.5;
      adjustedX = adjustedX - leftPanelWidthDiff;
      
      // 창 크기가 작아지면 중앙 기준점도 왼쪽으로 이동하므로 추가 조정
      if (scaleX < 1) {
        adjustedX = adjustedX - (savedWindowSize.width - currentWidth) * 0.1;
      }
    }
    
    // 반올림하여 깔끔한 정수값으로 반환
    return {
      x: Math.round(adjustedX),
      y: Math.round(adjustedY)
    };
  };

  const getResponsiveSize = (savedSize, savedWindowSize, isWidth = true, minSize = null, maxSize = null) => {
    if (!savedWindowSize || !isMounted) return savedSize;
    
    const currentSize = typeof window !== 'undefined' 
      ? (isWidth ? window.innerWidth : window.innerHeight)
      : (isWidth ? savedWindowSize.width : savedWindowSize.height);
    const savedSizeValue = isWidth ? savedWindowSize.width : savedWindowSize.height;
    
    const scale = currentSize / savedSizeValue;
    let newSize = savedSize * scale;
    
    // 최소/최대 크기 제한 적용
    if (minSize !== null && newSize < minSize) newSize = minSize;
    if (maxSize !== null && newSize > maxSize) newSize = maxSize;
    
    // 반올림하여 깔끔한 정수값으로 반환
    return Math.round(newSize);
  };

  const clampValue = (value, min, max) => Math.max(min, Math.min(max, value));

  const getChatBoundaryY = () => {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    return viewportHeight + CHAT_BOUNDARY_OFFSET;
  };

  const getCanvasRect = () => drawingCanvasRef.current?.getBoundingClientRect();

  const snapValue = (value) => (snapToGrid ? Math.round(value / gridSize) * gridSize : value);

  const getCanvasPoint = (e) => {
    const rect = getCanvasRect();
    if (!rect) return null;
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const clampCanvasPosition = (x, y, item) => {
    const rect = getCanvasRect();
    if (!rect) return { x, y };
    const maxX = Math.max(0, rect.width - item.width);
    const maxY = Math.max(0, rect.height - item.height);
    return {
      x: clampValue(snapValue(x), 0, maxX),
      y: clampValue(snapValue(y), 0, maxY)
    };
  };

  // Canvas undo/redo history (Ctrl+Z / Ctrl+Y)
  const canvasHistoryRef = useRef([]);
  const canvasRedoHistoryRef = useRef([]);
  const isUndoingCanvasRef = useRef(false);

  const pushCanvasHistory = () => {
    if (!isMounted || isUndoingCanvasRef.current) return;
    const snapshot = {
      items: JSON.parse(JSON.stringify(canvasItems)),
      links: JSON.parse(JSON.stringify(canvasLinks)),
      groups: JSON.parse(JSON.stringify(canvasGroups))
    };
    canvasHistoryRef.current.push(snapshot);
    // 새 작업이 생기면 redo 스택은 초기화
    canvasRedoHistoryRef.current = [];
    // 히스토리 최대 50단계까지만 유지
    if (canvasHistoryRef.current.length > 50) {
      canvasHistoryRef.current.shift();
    }
  };

  const handleAddCanvasItem = (type) => {
    pushCanvasHistory();
    const rect = getCanvasRect();
    const baseOffset = canvasItems.length * 20;
    const defaults = {
      rect: { width: 160, height: 120, text: '', fill: defaultFillColor },
      circle: { width: 140, height: 140, text: '', fill: defaultFillColor },
      text: { width: 200, height: 56, text: '텍스트 입력', fill: '#FFFFFF' },
      arrow: { width: 220, height: 80, text: '', fill: defaultLineColor },
      image: { width: 240, height: 160, text: '', fill: '#FFFFFF' }
    };
    const preset = defaults[type] || defaults.rect;
    const startX = rect ? Math.max(0, rect.width * 0.1) : 40;
    const startY = rect ? Math.max(0, rect.height * 0.1) : 40;
    const newItem = {
      id: Date.now() + Math.random(),
      type,
      x: snapValue(startX + baseOffset),
      y: snapValue(startY + baseOffset),
      width: preset.width,
      height: preset.height,
      text: preset.text,
      fill: preset.fill,
      src: '',
      textColor:
        type === 'arrow' || type === 'line' || type === 'image'
          ? undefined
          : defaultTextColor,
      borderColor:
        type === 'rect' || type === 'circle' || type === 'text'
          ? defaultBorderColor
          : undefined
    };
    setCanvasItems((prev) => [...prev, newItem]);
    setActiveCanvasItemId(newItem.id);
    if (type === 'text') {
      setTextModalTargetId(newItem.id);
      setTextModalTableTarget(null);
      setTextModalContent(preset.text || '');
      setIsTextModalOpen(true);
    }
  };

  const TABLE_CELL_SIZE = 36;

  const handleAddTable = (rows, cols) => {
    const safeRows = !Number.isNaN(rows) && rows > 0 ? rows : 1;
    const safeCols = !Number.isNaN(cols) && cols > 0 ? cols : 1;

    pushCanvasHistory();
    const rect = getCanvasRect();
    const baseOffset = canvasItems.length * 20;
    const width = safeCols * TABLE_CELL_SIZE;
    const height = safeRows * TABLE_CELL_SIZE;
    const startX = rect ? Math.max(0, rect.width * 0.1) : 40;
    const startY = rect ? Math.max(0, rect.height * 0.1) : 40;

    const newItem = {
      id: Date.now() + Math.random(),
      type: 'table',
      x: snapValue(startX + baseOffset),
      y: snapValue(startY + baseOffset),
      width,
      height,
      rows: safeRows,
      cols: safeCols,
      fill: '#FFFFFF',
      borderColor: defaultBorderColor,
      // 테이블 생성 시점의 텍스트 색을 고정해서,
      // 이후 전역 기본 텍스트 색 변경 시 기존 표 안 텍스트가 같이 변하지 않도록 함
      textColor: defaultTextColor,
      cells: Array.from({ length: safeRows }, () => Array(safeCols).fill('')),
      cellColors: Array.from({ length: safeRows }, () => Array(safeCols).fill(null)),
      cellRowspans: Array.from({ length: safeRows }, () => Array(safeCols).fill(1)),
      cellColspans: Array.from({ length: safeRows }, () => Array(safeCols).fill(1))
    };

    setCanvasItems((prev) => [...prev, newItem]);
    setActiveCanvasItemId(newItem.id);
  };

  const handleModifyTable = (tableId, type) => {
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id !== tableId || item.type !== 'table') return item;

        let rows = item.rows || 1;
        let cols = item.cols || 1;
        let x = item.x;
        let y = item.y;
        let cells =
          Array.isArray(item.cells) && item.cells.length === rows
            ? item.cells.map((r) =>
                Array.isArray(r) ? [...r] : Array(cols).fill('')
              )
            : Array.from({ length: rows }, () => Array(cols).fill(''));
        let cellColors =
          Array.isArray(item.cellColors) && item.cellColors.length === rows
            ? item.cellColors.map((r) =>
                Array.isArray(r) ? [...r] : Array(cols).fill(null)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(null));
        // 병합 정보 초기화 (행/열 변경 시 병합 해제)
        let cellRowspans = Array.from({ length: rows }, () => Array(cols).fill(1));
        let cellColspans = Array.from({ length: rows }, () => Array(cols).fill(1));

        switch (type) {
          // 열 추가
          case 'colRightPlus':
            cols += 1;
            cells = cells.map((row) => [...row, '']);
            cellColors = cellColors.map((row) => [...row, null]);
            cellRowspans = cellRowspans.map((row) => [...row, 1]);
            cellColspans = cellColspans.map((row) => [...row, 1]);
            break;
          case 'colLeftPlus':
            cols += 1;
            x -= TABLE_CELL_SIZE;
            cells = cells.map((row) => ['', ...row]);
            cellColors = cellColors.map((row) => [null, ...row]);
            cellRowspans = cellRowspans.map((row) => [1, ...row]);
            cellColspans = cellColspans.map((row) => [1, ...row]);
            break;
          // 열 삭제
          case 'colRightMinus':
            if (cols > 1) {
              cols -= 1;
              cells = cells.map((row) => row.slice(0, cols));
              cellColors = cellColors.map((row) => row.slice(0, cols));
              cellRowspans = cellRowspans.map((row) => row.slice(0, cols));
              cellColspans = cellColspans.map((row) => row.slice(0, cols));
            }
            break;
          case 'colLeftMinus':
            if (cols > 1) {
              cols -= 1;
              x += TABLE_CELL_SIZE;
              cells = cells.map((row) => row.slice(1));
              cellColors = cellColors.map((row) => row.slice(1));
              cellRowspans = cellRowspans.map((row) => row.slice(1));
              cellColspans = cellColspans.map((row) => row.slice(1));
            }
            break;
          // 행 추가
          case 'rowTopPlus':
            rows += 1;
            y -= TABLE_CELL_SIZE;
            cells = [Array(cols).fill(''), ...cells];
            cellColors = [Array(cols).fill(null), ...cellColors];
            cellRowspans = [Array(cols).fill(1), ...cellRowspans];
            cellColspans = [Array(cols).fill(1), ...cellColspans];
            break;
          case 'rowBottomPlus':
            rows += 1;
            cells = [...cells, Array(cols).fill('')];
            cellColors = [...cellColors, Array(cols).fill(null)];
            cellRowspans = [...cellRowspans, Array(cols).fill(1)];
            cellColspans = [...cellColspans, Array(cols).fill(1)];
            break;
          // 행 삭제
          case 'rowTopMinus':
            if (rows > 1) {
              rows -= 1;
              y += TABLE_CELL_SIZE;
              cells = cells.slice(1);
              cellColors = cellColors.slice(1);
              cellRowspans = cellRowspans.slice(1);
              cellColspans = cellColspans.slice(1);
            }
            break;
          case 'rowBottomMinus':
            if (rows > 1) {
              rows -= 1;
              cells = cells.slice(0, rows);
              cellColors = cellColors.slice(0, rows);
              cellRowspans = cellRowspans.slice(0, rows);
              cellColspans = cellColspans.slice(0, rows);
            }
            break;
          default:
            break;
        }

        return {
          ...item,
          x,
          y,
          rows,
          cols,
          cells,
          cellColors,
          cellRowspans,
          cellColspans,
          // 표 크기는 사용자가 조절한 값을 그대로 유지하고,
          // 행/열 개수만 변경되도록 한다.
          width: item.width,
          height: item.height
        };
      })
    );
  };

  // 셀이 병합 범위에 포함되어 있는지 확인
  const isCellMerged = (item, row, col) => {
    if (!item.cellRowspans || !item.cellColspans) return false;
    const rows = item.rows || 1;
    const cols = item.cols || 1;
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;

    // 위쪽이나 왼쪽 셀의 병합 범위에 포함되는지 확인
    for (let r = 0; r <= row; r++) {
      for (let c = 0; c <= col; c++) {
        if (r === row && c === col) continue;
        const rowspan = item.cellRowspans[r]?.[c] || 1;
        const colspan = item.cellColspans[r]?.[c] || 1;
        if (
          r <= row &&
          row < r + rowspan &&
          c <= col &&
          col < c + colspan &&
          (r !== row || c !== col)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // 선택한 셀이 병합 범위에 포함되어 있으면 병합의 시작 위치를 찾음
  const findMergeStart = (item, row, col) => {
    if (!item.cellRowspans || !item.cellColspans) return { row, col };
    const rows = item.rows || 1;
    const cols = item.cols || 1;

    // 위쪽이나 왼쪽 셀의 병합 범위에 포함되는지 확인하고 시작 위치 반환
    for (let r = 0; r <= row; r++) {
      for (let c = 0; c <= col; c++) {
        const rowspan = item.cellRowspans[r]?.[c] || 1;
        const colspan = item.cellColspans[r]?.[c] || 1;
        if (
          r <= row &&
          row < r + rowspan &&
          c <= col &&
          col < c + colspan
        ) {
          return { row: r, col: c };
        }
      }
    }
    return { row, col };
  };

  const handleMergeCellRight = (tableId) => {
    if (!activeTableCell || activeTableCell.tableId !== tableId) return;
    const { row, col } = activeTableCell;
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id !== tableId || item.type !== 'table') return item;
        const rows = item.rows || 1;
        const cols = item.cols || 1;

        // 병합의 시작 위치 찾기
        const startPos = findMergeStart(item, row, col);
        const startRow = startPos.row;
        const startCol = startPos.col;

        // 현재 병합의 colspan 확인
        const currentColspan = item.cellColspans?.[startRow]?.[startCol] || 1;
        const mergeEndCol = startCol + currentColspan - 1;

        // 오른쪽 끝이면 병합 불가
        if (mergeEndCol >= cols - 1) return item;

        const nextCol = mergeEndCol + 1;

        // 오른쪽 셀이 병합 범위에 포함되어 있으면 병합 불가
        if (isCellMerged(item, startRow, nextCol)) return item;

        const baseRowspans =
          Array.isArray(item.cellRowspans) && item.cellRowspans.length === rows
            ? item.cellRowspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));
        const baseColspans =
          Array.isArray(item.cellColspans) && item.cellColspans.length === rows
            ? item.cellColspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));

        const nextRowspans = baseRowspans.map((r) => [...r]);
        const nextColspans = baseColspans.map((r) => [...r]);

        // 병합의 시작 셀의 colspan 증가
        nextColspans[startRow][startCol] = currentColspan + 1;

        // 오른쪽 셀의 내용을 시작 셀에 추가
        const baseCells =
          Array.isArray(item.cells) && item.cells.length === rows
            ? item.cells.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill('')]
                  : Array(cols).fill('')
              )
            : Array.from({ length: rows }, () => Array(cols).fill(''));
        const nextCells = baseCells.map((r) => [...r]);
        if (nextCells[startRow][nextCol]) {
          nextCells[startRow][startCol] = (nextCells[startRow][startCol] || '') + (nextCells[startRow][nextCol] || '');
          nextCells[startRow][nextCol] = '';
        }

        return {
          ...item,
          cells: nextCells,
          cellColspans: nextColspans,
          cellRowspans: nextRowspans
        };
      })
    );
  };

  const handleMergeCellDown = (tableId) => {
    if (!activeTableCell || activeTableCell.tableId !== tableId) return;
    const { row, col } = activeTableCell;
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id !== tableId || item.type !== 'table') return item;
        const rows = item.rows || 1;
        const cols = item.cols || 1;

        // 병합의 시작 위치 찾기
        const startPos = findMergeStart(item, row, col);
        const startRow = startPos.row;
        const startCol = startPos.col;

        // 현재 병합의 rowspan 확인
        const currentRowspan = item.cellRowspans?.[startRow]?.[startCol] || 1;
        const mergeEndRow = startRow + currentRowspan - 1;

        // 아래 끝이면 병합 불가
        if (mergeEndRow >= rows - 1) return item;

        const nextRow = mergeEndRow + 1;

        // 아래 셀이 병합 범위에 포함되어 있으면 병합 불가
        if (isCellMerged(item, nextRow, startCol)) return item;

        const baseRowspans =
          Array.isArray(item.cellRowspans) && item.cellRowspans.length === rows
            ? item.cellRowspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));
        const baseColspans =
          Array.isArray(item.cellColspans) && item.cellColspans.length === rows
            ? item.cellColspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));

        const nextRowspans = baseRowspans.map((r) => [...r]);
        const nextColspans = baseColspans.map((r) => [...r]);

        // 병합의 시작 셀의 rowspan 증가
        nextRowspans[startRow][startCol] = currentRowspan + 1;

        // 아래 셀의 내용을 시작 셀에 추가
        const baseCells =
          Array.isArray(item.cells) && item.cells.length === rows
            ? item.cells.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill('')]
                  : Array(cols).fill('')
              )
            : Array.from({ length: rows }, () => Array(cols).fill(''));
        const nextCells = baseCells.map((r) => [...r]);
        if (nextCells[nextRow] && nextCells[nextRow][startCol]) {
          nextCells[startRow][startCol] = (nextCells[startRow][startCol] || '') + (nextCells[nextRow][startCol] || '');
          nextCells[nextRow][startCol] = '';
        }

        return {
          ...item,
          cells: nextCells,
          cellRowspans: nextRowspans,
          cellColspans: nextColspans
        };
      })
    );
  };

  const handleMergeCellLeft = (tableId) => {
    if (!activeTableCell || activeTableCell.tableId !== tableId) return;
    const { row, col } = activeTableCell;
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id !== tableId || item.type !== 'table') return item;
        const rows = item.rows || 1;
        const cols = item.cols || 1;

        // 병합의 시작 위치 찾기
        const startPos = findMergeStart(item, row, col);
        const startRow = startPos.row;
        const startCol = startPos.col;

        // 왼쪽 끝이면 병합 불가
        if (startCol <= 0) return item;

        const prevCol = startCol - 1;

        // 왼쪽 셀이 병합 범위에 포함되어 있으면 병합 불가
        if (isCellMerged(item, startRow, prevCol)) return item;

        const baseRowspans =
          Array.isArray(item.cellRowspans) && item.cellRowspans.length === rows
            ? item.cellRowspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));
        const baseColspans =
          Array.isArray(item.cellColspans) && item.cellColspans.length === rows
            ? item.cellColspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));

        const nextRowspans = baseRowspans.map((r) => [...r]);
        const nextColspans = baseColspans.map((r) => [...r]);

        // 현재 병합의 colspan 확인
        const currentColspan = nextColspans[startRow][startCol] || 1;

        // 왼쪽 셀의 colspan 증가 (현재 병합 크기만큼)
        const leftColspan = nextColspans[startRow][prevCol] || 1;
        nextColspans[startRow][prevCol] = leftColspan + currentColspan;

        // 현재 병합의 시작 셀을 초기화 (왼쪽 셀로 병합됨)
        nextColspans[startRow][startCol] = 1;

        // 현재 병합의 내용을 왼쪽 셀에 추가
        const baseCells =
          Array.isArray(item.cells) && item.cells.length === rows
            ? item.cells.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill('')]
                  : Array(cols).fill('')
              )
            : Array.from({ length: rows }, () => Array(cols).fill(''));
        const nextCells = baseCells.map((r) => [...r]);
        if (nextCells[startRow][startCol]) {
          nextCells[startRow][prevCol] =
            (nextCells[startRow][prevCol] || '') + (nextCells[startRow][startCol] || '');
          nextCells[startRow][startCol] = '';
        }

        return {
          ...item,
          cells: nextCells,
          cellColspans: nextColspans,
          cellRowspans: nextRowspans
        };
      })
    );
  };

  const handleMergeCellUp = (tableId) => {
    if (!activeTableCell || activeTableCell.tableId !== tableId) return;
    const { row, col } = activeTableCell;
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id !== tableId || item.type !== 'table') return item;
        const rows = item.rows || 1;
        const cols = item.cols || 1;

        // 병합의 시작 위치 찾기
        const startPos = findMergeStart(item, row, col);
        const startRow = startPos.row;
        const startCol = startPos.col;

        // 위쪽 끝이면 병합 불가
        if (startRow <= 0) return item;

        const prevRow = startRow - 1;

        // 위쪽 셀이 병합 범위에 포함되어 있으면 병합 불가
        if (isCellMerged(item, prevRow, startCol)) return item;

        const baseRowspans =
          Array.isArray(item.cellRowspans) && item.cellRowspans.length === rows
            ? item.cellRowspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));
        const baseColspans =
          Array.isArray(item.cellColspans) && item.cellColspans.length === rows
            ? item.cellColspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));

        const nextRowspans = baseRowspans.map((r) => [...r]);
        const nextColspans = baseColspans.map((r) => [...r]);

        // 현재 병합의 rowspan 확인
        const currentRowspan = nextRowspans[startRow][startCol] || 1;

        // 위쪽 셀의 rowspan 증가 (현재 병합 크기만큼)
        const upRowspan = nextRowspans[prevRow][startCol] || 1;
        nextRowspans[prevRow][startCol] = upRowspan + currentRowspan;

        // 현재 병합의 시작 셀을 초기화 (위쪽 셀로 병합됨)
        nextRowspans[startRow][startCol] = 1;

        // 현재 병합의 내용을 위쪽 셀에 추가
        const baseCells =
          Array.isArray(item.cells) && item.cells.length === rows
            ? item.cells.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill('')]
                  : Array(cols).fill('')
              )
            : Array.from({ length: rows }, () => Array(cols).fill(''));
        const nextCells = baseCells.map((r) => [...r]);
        if (nextCells[startRow] && nextCells[startRow][startCol]) {
          nextCells[prevRow][startCol] =
            (nextCells[prevRow][startCol] || '') + (nextCells[startRow][startCol] || '');
          nextCells[startRow][startCol] = '';
        }

        return {
          ...item,
          cells: nextCells,
          cellRowspans: nextRowspans,
          cellColspans: nextColspans
        };
      })
    );
  };

  const handleUnmergeCell = (tableId) => {
    if (!activeTableCell || activeTableCell.tableId !== tableId) return;
    const { row, col } = activeTableCell;
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id !== tableId || item.type !== 'table') return item;
        const rows = item.rows || 1;
        const cols = item.cols || 1;

        const baseRowspans =
          Array.isArray(item.cellRowspans) && item.cellRowspans.length === rows
            ? item.cellRowspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));
        const baseColspans =
          Array.isArray(item.cellColspans) && item.cellColspans.length === rows
            ? item.cellColspans.map((r) =>
                Array.isArray(r)
                  ? [...r, ...Array(Math.max(0, cols - r.length)).fill(1)]
                  : Array(cols).fill(1)
              )
            : Array.from({ length: rows }, () => Array(cols).fill(1));

        const nextRowspans = baseRowspans.map((r) => [...r]);
        const nextColspans = baseColspans.map((r) => [...r]);

        // 현재 셀의 병합 해제
        nextRowspans[row][col] = 1;
        nextColspans[row][col] = 1;

        return {
          ...item,
          cellRowspans: nextRowspans,
          cellColspans: nextColspans
        };
      })
    );
  };

  const handleOpenTableModal = () => {
    setTableRows(3);
    setTableCols(3);
    setIsTableModalOpen(true);
  };

  const handleConfirmTableModal = () => {
    const rows = parseInt(tableRows, 10);
    const cols = parseInt(tableCols, 10);
    if (Number.isNaN(rows) || Number.isNaN(cols) || rows <= 0 || cols <= 0) {
      alert('행과 열은 1 이상의 숫자로 입력해주세요.');
      return;
    }
    handleAddTable(rows, cols);
    setIsTableModalOpen(false);
  };

  const handleCanvasItemDragStart = (e, itemId) => {
    if (isLineMode) return;
    if (isConnectMode) return;
    e.preventDefault();
    e.stopPropagation();
    const item = canvasItems.find((c) => c.id === itemId);
    // 텍스트 편집 중에는 드래그 비활성화
    if (item?.type === 'text' && editingTextItemId === itemId) return;
    const rect = getCanvasRect();
    if (!item || !rect) return;
    pushCanvasHistory();
    
    // 그룹에 속해 있으면 그룹 전체 선택
    const group = canvasGroups.find((g) => g.itemIds.includes(itemId));
    if (group) {
      setActiveCanvasGroupId(group.id);
      setActiveCanvasItemId(itemId);
      setSelectedCanvasItemIds(group.itemIds);
    } else {
      setActiveCanvasGroupId(null);
      setActiveCanvasItemId(itemId);
      setSelectedCanvasItemIds((prev) =>
        prev && prev.length && prev.includes(itemId) ? prev : [itemId]
      );
    }
    
    setIsDraggingCanvasItem(true);
    setCanvasItemDragStart({
      x: e.clientX - rect.left - item.x,
      y: e.clientY - rect.top - item.y
    });
  };

  const handleCanvasResizeStart = (e, itemId, handle) => {
    e.preventDefault();
    e.stopPropagation();
    const item = canvasItems.find((c) => c.id === itemId);
    if (!item) return;
    pushCanvasHistory();
    setActiveCanvasItemId(itemId);
    setIsResizingCanvasItem(true);
    setCanvasResizeStart({
      id: itemId,
      handle,
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height
    });
  };

  const handleSendToBack = () => {
    // 선택된 도형이 없으면 종료
    if (!activeCanvasItemId && (!selectedCanvasItemIds || !selectedCanvasItemIds.length)) {
      return;
    }

    pushCanvasHistory();

    // 맨 뒤로 보낼 도형 ID 목록 (다중 선택이 있으면 그 집합, 없으면 active 하나)
    const targetIds =
      selectedCanvasItemIds && selectedCanvasItemIds.length
        ? selectedCanvasItemIds
        : activeCanvasItemId
          ? [activeCanvasItemId]
          : [];
    if (!targetIds.length) return;

    setCanvasItems((prev) => {
      // 선택된 아이템들을 배열에서 제거
      const itemsToMove = prev.filter((item) => targetIds.includes(item.id));
      const remainingItems = prev.filter((item) => !targetIds.includes(item.id));
      // 맨 앞에 배치 (맨 뒤로 렌더링되도록)
      return [...itemsToMove, ...remainingItems];
    });
  };

  const handleDeleteActiveCanvasItem = () => {
    // 삭제 대상이 전혀 없으면 종료
    if (!activeCanvasItemId && !activeCanvasLinkId && (!selectedCanvasItemIds || !selectedCanvasItemIds.length)) {
      return;
    }

    pushCanvasHistory();

    // 링크만 선택된 경우: 해당 링크만 삭제
    if (activeCanvasLinkId && (!selectedCanvasItemIds || !selectedCanvasItemIds.length)) {
      setCanvasLinks((prev) => prev.filter((link) => link.id !== activeCanvasLinkId));
      setActiveCanvasLinkId(null);
      return;
    }

    // 삭제할 도형 ID 목록 (다중 선택이 있으면 그 집합, 없으면 active 하나)
    const targetIds =
      selectedCanvasItemIds && selectedCanvasItemIds.length
        ? selectedCanvasItemIds
        : activeCanvasItemId
          ? [activeCanvasItemId]
          : [];
    if (!targetIds.length) return;

    const targetIdSet = new Set(targetIds);

    // 1) 연결선 정리: 삭제 대상 도형과 연결된 선들은 모두 삭제
    setCanvasLinks((prev) =>
      prev.filter((link) => !targetIdSet.has(link.fromId) && !targetIdSet.has(link.toId))
    );

    // 2) 도형 삭제
    setCanvasItems((prev) =>
      prev.filter((item) => !targetIdSet.has(item.id))
    );

    // 3) 그룹에서 삭제된 도형 제거, 비어 있는 그룹은 삭제
    setCanvasGroups((prev) =>
      prev
        .map((g) => ({
          ...g,
          itemIds: g.itemIds.filter((id) => !targetIdSet.has(id))
        }))
        .filter((g) => g.itemIds.length > 0)
    );

    setActiveCanvasItemId(null);
    setActiveCanvasGroupId(null);
    setSelectedCanvasItemIds([]);
    setActiveCanvasLinkId(null);
    setEditingTextItemId(null);
  };

  const handleDuplicateActiveCanvasItem = () => {
    const item = canvasItems.find((c) => c.id === activeCanvasItemId);
    if (!item) return;
    pushCanvasHistory();
    const duplicate = {
      ...item,
      id: Date.now() + Math.random(),
      x: snapValue(item.x + 24),
      y: snapValue(item.y + 24)
    };
    setCanvasItems((prev) => [...prev, duplicate]);
    setActiveCanvasItemId(duplicate.id);
  };

  const handleChangeActiveFill = (value) => {
    // 기본 채우기 색 업데이트 (선택된 도형이 없어도 반영)
    setDefaultFillColor(value);
    if (!activeCanvasItemId) return;
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((item) => (item.id === activeCanvasItemId ? { ...item, fill: value } : item))
    );
  };

  // 텍스트 색 변경 툴은 제거됨 (기본 텍스트 색은 도형/표 생성 시점 기준으로만 사용)

  const handleChangeActiveLinkColor = (value) => {
    // 기본 선 색 업데이트
    setDefaultLineColor(value);
    // 히스토리 저장 (선/화살표/라인 모두에 적용될 수 있으므로 한 번만)
    pushCanvasHistory();

    // 연결선 색 변경
    if (activeCanvasLinkId) {
      setCanvasLinks((prev) =>
        prev.map((link) =>
          link.id === activeCanvasLinkId ? { ...link, color: value } : link
        )
      );
    }

    // 화살표/자유선 도형 색 변경
    if (activeCanvasItemId) {
      setCanvasItems((prev) =>
        prev.map((item) =>
          item.id === activeCanvasItemId && (item.type === 'arrow' || item.type === 'line')
            ? { ...item, fill: value }
            : item
        )
      );
    }
  };

  const handleChangeActiveBorderColor = (value) => {
    const targetIds =
      selectedCanvasItemIds && selectedCanvasItemIds.length
        ? selectedCanvasItemIds
        : activeCanvasItemId
          ? [activeCanvasItemId]
          : [];

    // 선택된 도형이 없으면: 기본 테두리 색만 변경 (기존 도형은 그대로)
    if (!targetIds.length) {
      setDefaultBorderColor(value);
      return;
    }

    // 선택된 도형이 있는 경우: 해당 도형들만 변경
    const targetSet = new Set(targetIds);
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((item) =>
        targetSet.has(item.id) &&
        (item.type === 'rect' || item.type === 'circle' || item.type === 'text' || item.type === 'table')
          ? { ...item, borderColor: value }
          : item
      )
    );

    // 이후에 새로 만드는 도형의 기본 테두리 색도 이 값으로 설정
    setDefaultBorderColor(value);
  };

  const handleChangeActiveLinkWidth = (value) => {
    const numeric = Number(value);

    const hasActiveLink = !!activeCanvasLinkId;
    const activeLineItem =
      activeCanvasItemId &&
      canvasItems.find(
        (item) =>
          item.id === activeCanvasItemId &&
          (item.type === 'line' || item.type === 'arrow')
      );

    // 선택된 게 하나도 없어도 기본 굵기는 항상 변경
    setDefaultStrokeWidth(numeric);

    // 선택된 링크/선/화살표가 없으면 여기서 끝 (기본값만 변경)
    if (!hasActiveLink && !activeLineItem) return;

    pushCanvasHistory();

    // 연결선 굵기 변경
    if (hasActiveLink) {
      setCanvasLinks((prev) =>
        prev.map((link) =>
          link.id === activeCanvasLinkId ? { ...link, width: numeric } : link
        )
      );
    }

    // 선/화살표 도형 굵기 변경
    if (activeLineItem) {
      setCanvasItems((prev) =>
        prev.map((item) =>
          item.id === activeCanvasItemId &&
          (item.type === 'line' || item.type === 'arrow')
            ? { ...item, strokeWidth: numeric }
            : item
        )
      );
    }
  };

  const handleChangeActiveLinkLabel = (value) => {
    if (!activeCanvasLinkId) return;
    pushCanvasHistory();
    setCanvasLinks((prev) =>
      prev.map((link) => (link.id === activeCanvasLinkId ? { ...link, label: value } : link))
    );
  };

  const handleCanvasItemClick = (e, itemId) => {
    e.stopPropagation();
    setActiveCanvasLinkId(null);
    setActiveTableCell(null);
    if (!isConnectMode) {
      // 그룹에 속해 있으면 그룹 전체 선택
      const group = canvasGroups.find((g) => g.itemIds.includes(itemId));
      if (group) {
        setActiveCanvasGroupId(group.id);
        setActiveCanvasItemId(itemId);
        setSelectedCanvasItemIds(group.itemIds);
      } else {
        setActiveCanvasGroupId(null);
        setActiveCanvasItemId(itemId);
        setSelectedCanvasItemIds([itemId]);
      }
      return;
    }
    const item = canvasItems.find((c) => c.id === itemId);
    if (!item) return;
    const clickPoint = getCanvasPoint(e);
    if (!clickPoint) return;
    const ports = getCanvasPorts(item);
    const nearestPort = getNearestPort(clickPoint, ports);
    if (!connectFrom) {
      setConnectFrom({ id: itemId, port: nearestPort });
      setActiveCanvasItemId(itemId);
      return;
    }
    if (connectFrom.id === itemId) return;
    pushCanvasHistory();
    const newLink = {
      id: Date.now() + Math.random(),
      fromId: connectFrom.id,
      fromPort: connectFrom.port,
      toId: itemId,
      toPort: nearestPort,
      color: defaultLineColor,
      width: 3,
      label: ''
    };
    setCanvasLinks((prev) => [...prev, newLink]);
    setConnectFrom(null);
    setIsConnectMode(false);
  };

  const handleCanvasPortClick = (e, itemId, port) => {
    e.stopPropagation();
    setActiveCanvasLinkId(null);
    if (!isConnectMode) {
      setActiveCanvasItemId(itemId);
      return;
    }
    if (!connectFrom) {
      setConnectFrom({ id: itemId, port });
      setActiveCanvasItemId(itemId);
      return;
    }
    if (connectFrom.id === itemId) return;
    pushCanvasHistory();
    const newLink = {
      id: Date.now() + Math.random(),
      fromId: connectFrom.id,
      fromPort: connectFrom.port,
      toId: itemId,
      toPort: port,
      color: defaultLineColor,
      width: 3,
      label: ''
    };
    setCanvasLinks((prev) => [...prev, newLink]);
    setConnectFrom(null);
    setIsConnectMode(false);
  };

  const getCanvasItemCenter = (item) => ({
    x: item.x + item.width / 2,
    y: item.y + item.height / 2
  });

  const getCanvasPorts = (item) => {
    const centerX = item.x + item.width / 2;
    const centerY = item.y + item.height / 2;
    
    if (item.type === 'circle') {
      // 원의 경우 동적으로 계산되므로 여기서는 기본 포트만 반환
      const radius = Math.min(item.width, item.height) / 2;
      return {
        top: { x: centerX, y: centerY - radius },
        right: { x: centerX + radius, y: centerY },
        bottom: { x: centerX, y: centerY + radius },
        left: { x: centerX - radius, y: centerY }
      };
    }
    
    // 사각형의 경우 모서리와 중앙 포트 모두 제공
    if (item.type === 'rect') {
      return {
        top: { x: centerX, y: item.y },
        topRight: { x: item.x + item.width, y: item.y },
        right: { x: item.x + item.width, y: centerY },
        bottomRight: { x: item.x + item.width, y: item.y + item.height },
        bottom: { x: centerX, y: item.y + item.height },
        bottomLeft: { x: item.x, y: item.y + item.height },
        left: { x: item.x, y: centerY },
        topLeft: { x: item.x, y: item.y }
      };
    }
    
    // 기타 도형의 경우 기존 방식 (중앙 포트만)
    return {
      top: { x: centerX, y: item.y },
      right: { x: item.x + item.width, y: centerY },
      bottom: { x: centerX, y: item.y + item.height },
      left: { x: item.x, y: centerY }
    };
  };

  // 원의 경계에서 가장 가까운 점 계산
  const getCircleBoundaryPoint = (item, point) => {
    const centerX = item.x + item.width / 2;
    const centerY = item.y + item.height / 2;
    const radius = Math.min(item.width, item.height) / 2;
    
    // 중심에서 마우스까지의 각도 계산
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    const angle = Math.atan2(dy, dx);
    
    // 원의 경계점 계산
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const getNearestPort = (point, ports) => {
    const entries = Object.entries(ports);
    let best = entries[0][0];
    let bestDist = Number.POSITIVE_INFINITY;
    entries.forEach(([key, p]) => {
      const dist = Math.abs(point.x - p.x) + Math.abs(point.y - p.y);
      if (dist < bestDist) {
        bestDist = dist;
        best = key;
      }
    });
    return best;
  };

  const getNearestPortMatch = (point) => {
    const candidates = canvasItems.filter(
      (item) => !['line', 'arrow'].includes(item.type)
    );
    const threshold = 18;
    let best = null;
    let bestDist = Number.POSITIVE_INFINITY;
    
    candidates.forEach((item) => {
      if (item.type === 'circle') {
        // 원의 경우 마우스 위치에 따라 가장 가까운 경계점 계산
        const boundaryPoint = getCircleBoundaryPoint(item, point);
        const dist = Math.sqrt(
          Math.pow(point.x - boundaryPoint.x, 2) + 
          Math.pow(point.y - boundaryPoint.y, 2)
        );
        if (dist < bestDist && dist <= threshold) {
          bestDist = dist;
          best = { 
            id: item.id, 
            port: 'boundary', // 원의 경우 특별한 포트 이름 사용
            point: boundaryPoint 
          };
        }
      } else {
        // 다른 도형의 경우 포트 중 가장 가까운 것 찾기
        const ports = getCanvasPorts(item);
        Object.entries(ports).forEach(([key, p]) => {
          const dist = Math.sqrt(
            Math.pow(point.x - p.x, 2) + 
            Math.pow(point.y - p.y, 2)
          );
          if (dist < bestDist) {
            bestDist = dist;
            best = { id: item.id, port: key, point: p };
          }
        });
      }
    });
    
    return best && bestDist <= threshold ? best : null;
  };

  const normalizeLineItem = (startX, startY, endX, endY, strokeWidth = 3) => {
    // strokeWidth를 고려한 여유 공간 추가 (선의 끝이 잘리지 않도록)
    const padding = Math.ceil(strokeWidth / 2);
    const x = Math.min(startX, endX) - padding;
    const y = Math.min(startY, endY) - padding;
    const width = Math.max(2, Math.abs(endX - startX) + padding * 2);
    const height = Math.max(2, Math.abs(endY - startY) + padding * 2);
    return { x, y, width, height, startX, startY, endX, endY };
  };

  const getLineEndpoints = (line, items = canvasItems) => {
    let start = null;
    let end = null;
    
    // 먼저 시작점과 끝점의 기본 위치를 계산
    if (line.fromId) {
      const from = items.find((i) => i.id === line.fromId);
      if (from) {
        if (from.type === 'circle' && line.fromPort === 'boundary') {
          // 원의 경우 일단 중심점 사용 (나중에 끝점 기준으로 재계산)
          start = getCanvasItemCenter(from);
        } else {
          const fromPorts = getCanvasPorts(from);
          start = fromPorts[line.fromPort] || getCanvasItemCenter(from);
        }
      }
    }
    if (!start && line.startX !== undefined && line.startY !== undefined) {
      start = { x: line.startX, y: line.startY };
    }
    
    if (line.toId) {
      const to = items.find((i) => i.id === line.toId);
      if (to) {
        if (to.type === 'circle' && line.toPort === 'boundary') {
          // 원의 경우 일단 중심점 사용 (나중에 시작점 기준으로 재계산)
          end = getCanvasItemCenter(to);
        } else {
          const toPorts = getCanvasPorts(to);
          end = toPorts[line.toPort] || getCanvasItemCenter(to);
        }
      }
    }
    if (!end && line.endX !== undefined && line.endY !== undefined) {
      end = { x: line.endX, y: line.endY };
    }
    
    // 원의 boundary 포트가 있는 경우 다른 끝점을 기준으로 재계산
    if (line.fromId) {
      const from = items.find((i) => i.id === line.fromId);
      if (from && from.type === 'circle' && line.fromPort === 'boundary' && end) {
        start = getCircleBoundaryPoint(from, end);
      }
    }
    if (line.toId) {
      const to = items.find((i) => i.id === line.toId);
      if (to && to.type === 'circle' && line.toPort === 'boundary' && start) {
        end = getCircleBoundaryPoint(to, start);
      }
    }
    
    if (!start || !end) return null;
    return { start, end };
  };

  const getLinkEndpoints = (link) => {
    let start = null;
    let end = null;
    
    // 먼저 시작점과 끝점의 기본 위치를 계산
    if (link.fromId) {
      const from = canvasItems.find((i) => i.id === link.fromId);
      if (from) {
        if (from.type === 'circle' && link.fromPort === 'boundary') {
          start = getCanvasItemCenter(from);
        } else {
          const fromPorts = getCanvasPorts(from);
          start = fromPorts[link.fromPort] || getCanvasItemCenter(from);
        }
      }
    }
    if (!start && link.fromPoint) start = link.fromPoint;
    
    if (link.toId) {
      const to = canvasItems.find((i) => i.id === link.toId);
      if (to) {
        if (to.type === 'circle' && link.toPort === 'boundary') {
          end = getCanvasItemCenter(to);
        } else {
          const toPorts = getCanvasPorts(to);
          end = toPorts[link.toPort] || getCanvasItemCenter(to);
        }
      }
    }
    if (!end && link.toPoint) end = link.toPoint;
    
    // 원의 boundary 포트가 있는 경우 다른 끝점을 기준으로 재계산
    if (link.fromId) {
      const from = canvasItems.find((i) => i.id === link.fromId);
      if (from && from.type === 'circle' && link.fromPort === 'boundary' && end) {
        start = getCircleBoundaryPoint(from, end);
      }
    }
    if (link.toId) {
      const to = canvasItems.find((i) => i.id === link.toId);
      if (to && to.type === 'circle' && link.toPort === 'boundary' && start) {
        end = getCircleBoundaryPoint(to, start);
      }
    }
    
    if (!start || !end) return null;
    return { start, end };
  };

  const getConnectionPath = (link) => {
    const endpoints = getLinkEndpoints(link);
    if (!endpoints) return null;
    const { start, end } = endpoints;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    let startX = start.x;
    let startY = start.y;
    let endX = end.x;
    let endY = end.y;
    if (horizontal) {
      const midX = link.bend?.x ?? (startX + endX) / 2;
      return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    }
    const midY = link.bend?.y ?? (startY + endY) / 2;
    return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
  };

  const getConnectionLabelPos = (link) => {
    const endpoints = getLinkEndpoints(link);
    if (!endpoints) return null;
    const { start, end } = endpoints;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    if (horizontal) {
      const midX = link.bend?.x ?? (start.x + end.x) / 2;
      return { x: midX, y: (start.y + end.y) / 2 - 8 };
    }
    const midY = link.bend?.y ?? (start.y + end.y) / 2;
    return { x: (start.x + end.x) / 2, y: midY - 8 };
  };

  const getConnectionHandlePos = (link) => {
    const endpoints = getLinkEndpoints(link);
    if (!endpoints) return null;
    const { start, end } = endpoints;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    if (horizontal) {
      const midX = link.bend?.x ?? (start.x + end.x) / 2;
      return { x: midX, y: (start.y + end.y) / 2 };
    }
    const midY = link.bend?.y ?? (start.y + end.y) / 2;
    return { x: (start.x + end.x) / 2, y: midY };
  };

  const handleCanvasLineStart = (e) => {
    if (!isLineMode) return false;
    const point = getCanvasPoint(e);
    if (!point) return false;
    const startX = snapValue(point.x);
    const startY = snapValue(point.y);
    setLineDraft({
      startX,
      startY,
      endX: startX,
      endY: startY,
      x: startX,
      y: startY,
      width: 0,
      height: 0
    });
    return true;
  };

  const finalizeLineDraft = () => {
    if (!lineDraft) return;
    const minSize = 6;
    if (lineDraft.width < minSize && lineDraft.height < minSize) {
      setLineDraft(null);
      return;
    }
    pushCanvasHistory();
    const width = Math.max(2, lineDraft.width);
    const height = Math.max(2, lineDraft.height);
    const newItem = {
      id: Date.now() + Math.random(),
      type: 'line',
      x: lineDraft.x,
      y: lineDraft.y,
      width,
      height,
      startX: lineDraft.startX,
      startY: lineDraft.startY,
      endX: lineDraft.endX,
      endY: lineDraft.endY,
      text: '',
      fill: defaultLineColor,
      strokeWidth: defaultStrokeWidth,
      src: ''
    };
    setCanvasItems((prev) => [...prev, newItem]);
    setActiveCanvasItemId(newItem.id);
    setLineDraft(null);
  };

  const handleExportCanvas = () => {
    const payload = JSON.stringify({ items: canvasItems, links: canvasLinks }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas-items.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportCanvas = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        pushCanvasHistory();
        if (Array.isArray(parsed)) {
          setCanvasItems(parsed);
          setCanvasLinks([]);
          setActiveCanvasItemId(null);
          setActiveCanvasLinkId(null);
          return;
        }
        if (parsed && Array.isArray(parsed.items)) {
          setCanvasItems(parsed.items);
          setCanvasLinks(Array.isArray(parsed.links) ? parsed.links : []);
          setActiveCanvasItemId(null);
          setActiveCanvasLinkId(null);
        }
      } catch (err) {
        console.error('Invalid canvas file:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      pushCanvasHistory();
      const rect = getCanvasRect();
      const baseOffset = canvasItems.length * 20;
      const startX = rect ? Math.max(0, rect.width * 0.1) : 40;
      const startY = rect ? Math.max(0, rect.height * 0.1) : 40;
      const newItem = {
        id: Date.now() + Math.random(),
        type: 'image',
        x: snapValue(startX + baseOffset),
        y: snapValue(startY + baseOffset),
        width: 260,
        height: 180,
        text: '',
        src: reader.result
      };
      setCanvasItems((prev) => [...prev, newItem]);
      setActiveCanvasItemId(newItem.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const getMemoPadDimensions = () => {
    const width = memoPadRef.current?.offsetWidth || 140;
    const height = memoPadRef.current?.offsetHeight || 44;
    return { width, height };
  };

  const getToolbarDimensions = () => {
    const width = toolbarRef.current?.offsetWidth || 420;
    const height = toolbarRef.current?.offsetHeight || 56;
    return { width, height };
  };

  const getQaBounds = (windowWidth, windowHeight, qaPosition, qaSize) => {
    const centerX = windowWidth / 2 + qaPosition.x;
    const centerY = windowHeight / 2 + qaPosition.y;
    return {
      left: centerX - qaSize.width / 2,
      right: centerX + qaSize.width / 2,
      top: centerY - qaSize.height / 2,
      bottom: centerY + qaSize.height / 2
    };
  };

  const getNonOverlappingPosition = (position, size, qaBounds, viewport, margin = 12) => {
    const memoBounds = {
      left: position.x,
      right: position.x + size.width,
      top: position.y,
      bottom: position.y + size.height
    };
    const overlaps = !(
      memoBounds.right <= qaBounds.left ||
      memoBounds.left >= qaBounds.right ||
      memoBounds.bottom <= qaBounds.top ||
      memoBounds.top >= qaBounds.bottom
    );
    if (!overlaps) {
      return position;
    }

    const minX = 20;
    const minY = 20;
    const maxX = Math.max(minX, viewport.width - size.width - 20);
    const maxY = Math.max(minY, viewport.height - size.height - 20);

    const candidates = [
      { x: qaBounds.right + margin, y: position.y },
      { x: qaBounds.left - margin - size.width, y: position.y },
      { x: position.x, y: qaBounds.bottom + margin },
      { x: position.x, y: qaBounds.top - margin - size.height }
    ];

    let best = position;
    let bestDelta = Number.POSITIVE_INFINITY;
    candidates.forEach((candidate) => {
      const bounded = {
        x: clampValue(candidate.x, minX, maxX),
        y: clampValue(candidate.y, minY, maxY)
      };
      const delta = Math.abs(bounded.x - position.x) + Math.abs(bounded.y - position.y);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = bounded;
      }
    });

    return best;
  };

  const normalizePositions = (positions) => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const normalized = { ...positions };
    if (!normalized.windowSize) {
      normalized.windowSize = { width: windowWidth, height: windowHeight };
    }
    if (!normalized.qaWindow.width) normalized.qaWindow.width = 900;
    if (!normalized.qaWindow.height) normalized.qaWindow.height = 600;
    if (!normalized.input.width) normalized.input.width = 900;
    if (!normalized.drawingArea) {
      normalized.drawingArea = { x: 0, y: 0 };
    }
    if (!normalized.memoPad) {
      normalized.memoPad = { x: 0, y: 0, anchor: 'left' };
    }
    if (!normalized.presetId) {
      normalized.presetId = null;
    }
    return normalized;
  };

  const normalizeMemoForTemplate = (memo, windowSize) => ({
    ...memo,
    basePosition: memo.basePosition || memo.position,
    baseSize: memo.baseSize || memo.size,
    baseWindowSize: memo.baseWindowSize || windowSize
  });

  const applyPositions = (positions) => {
    const normalized = normalizePositions(positions);
    setSavedPositions(normalized);
    setLeftPanelPosition({ x: normalized.leftPanel.x, y: normalized.leftPanel.y });
    setLeftPanelWidth(normalized.leftPanel.width);
    setLeftPanelHeight(normalized.leftPanel.height);
    setRightPanelPosition({ x: normalized.rightPanel.x, y: normalized.rightPanel.y });
    setRightPanelWidth(normalized.rightPanel.width);
    setRightPanelHeight(normalized.rightPanel.height);
    setToolbarPosition({ x: normalized.toolbar.x, y: normalized.toolbar.y });
    setQaWindowPosition({ x: normalized.qaWindow.x, y: normalized.qaWindow.y });
    setQaWindowSize({ width: normalized.qaWindow.width, height: normalized.qaWindow.height });
    setInputPosition({ x: normalized.input.x, y: normalized.input.y });
    setInputSize({ width: normalized.input.width });
    setDrawingAreaPosition({ x: normalized.drawingArea.x, y: normalized.drawingArea.y });
    setMemoPadPosition({ x: normalized.memoPad.x, y: normalized.memoPad.y });
  };

  // Apply responsive positions when window size changes or saved positions change
  useEffect(() => {
    if (!isMounted || !savedPositions.windowSize) return;

    let resizeTimeout;
    const updatePositions = () => {
      const savedWindowSize = savedPositions.windowSize;
      const currentWidth = typeof window !== 'undefined' ? window.innerWidth : savedWindowSize.width;
      const currentHeight = typeof window !== 'undefined' ? window.innerHeight : savedWindowSize.height;
      
      // Update left panel with min/max constraints
      const leftPos = getResponsivePosition(
        { x: savedPositions.leftPanel.x, y: savedPositions.leftPanel.y },
        savedWindowSize
      );
      const leftWidth = getResponsiveSize(
        savedPositions.leftPanel.width, 
        savedWindowSize, 
        true, 
        200, // min width
        600  // max width
      );
      const leftHeight = getResponsiveSize(
        savedPositions.leftPanel.height, 
        savedWindowSize, 
        false,
        300, // min height
        currentHeight // max height
      );
      
      setLeftPanelPosition(leftPos);
      setLeftPanelWidth(leftWidth);
      setLeftPanelHeight(leftHeight);

      // Update right panel with min/max constraints
      const rightPos = getResponsivePosition(
        { x: savedPositions.rightPanel.x, y: savedPositions.rightPanel.y },
        savedWindowSize
      );
      const rightWidth = getResponsiveSize(
        savedPositions.rightPanel.width, 
        savedWindowSize, 
        true,
        200, // min width
        600  // max width
      );
      const rightHeight = getResponsiveSize(
        savedPositions.rightPanel.height, 
        savedWindowSize, 
        false,
        300, // min height
        currentHeight // max height
      );
      
      setRightPanelPosition(rightPos);
      setRightPanelWidth(rightWidth);
      setRightPanelHeight(rightHeight);

      // Update toolbar (keep within viewport bounds)
      const toolbarPos = getResponsivePosition(savedPositions.toolbar, savedWindowSize, false);
      const { width: toolbarWidth, height: toolbarHeight } = getToolbarDimensions();
      const boundedToolbarPos = {
        x: clampValue(toolbarPos.x, 20, Math.max(20, currentWidth - toolbarWidth - 20)),
        y: clampValue(toolbarPos.y, 20, Math.max(20, currentHeight - toolbarHeight - 20))
      };
      setToolbarPosition(boundedToolbarPos);

      // Compute center area between left/right panels
      const leftPanelRightEdge = leftPos.x + leftWidth;
      const rightPanelLeftEdge = currentWidth - rightWidth + rightPos.x;
      const rawCenterLeft = Math.max(20, leftPanelRightEdge + 20);
      const rawCenterRight = Math.min(currentWidth - 20, rightPanelLeftEdge - 20);
      const hasCenterArea = rawCenterRight > rawCenterLeft + 200;
      const centerAreaLeft = hasCenterArea ? rawCenterLeft : rawCenterLeft;
      const centerAreaRight = hasCenterArea
        ? rawCenterRight
        : Math.max(rawCenterLeft + 200, currentWidth - 20);
      const centerAreaWidth = Math.max(300, centerAreaRight - centerAreaLeft);
      const centerAreaX = (centerAreaLeft + centerAreaRight) / 2;

      // Update Q&A window (centered element, needs special handling with left/right panels)
      const savedQaWidth = savedPositions.qaWindow.width || 900;
      const savedQaHeight = savedPositions.qaWindow.height || 600;
      const isDefaultPreset =
        savedPositions.presetId === 'default' ||
        (savedPositions.qaWindow.width === 900 && savedPositions.input.width === 900);
      const adaptiveCenterWidth = Math.min(1100, centerAreaWidth);
      
      // QA 창 너비: 좌/우 패널 사이 공간을 고려하여 조정
      const qaWidth = isDefaultPreset
        ? Math.max(300, adaptiveCenterWidth)
        : getResponsiveSize(savedQaWidth, savedWindowSize, true, 300, centerAreaWidth);
      const qaHeight = getResponsiveSize(savedQaHeight, savedWindowSize, false, 300, currentHeight - 200);
      
      // QA 창 위치 계산: 저장된 위치를 기준으로 비율 조정
      const scaleX = currentWidth / savedWindowSize.width;
      const scaleY = currentHeight / savedWindowSize.height;
      
      // 저장된 위치는 중앙 기준 오프셋이므로, 비율 조정
      let qaX = savedPositions.qaWindow.x * scaleX;
      let qaY = savedPositions.qaWindow.y * scaleY;
      
      // QA 창이 화면 밖으로 나가지 않도록 제한
      // 중앙 기준이므로, 왼쪽 경계: leftWidth + qaWidth/2 + 20
      // 오른쪽 경계: currentWidth - qaWidth/2 - 20
      const qaLeftBound = centerAreaLeft + qaWidth / 2;
      const qaRightBound = centerAreaRight - qaWidth / 2;
      const qaCenterX = centerAreaX;
      
      // 중앙에서의 오프셋을 유지하되, 경계를 넘지 않도록 조정
      const finalQaX = Math.max(qaLeftBound - qaCenterX, Math.min(qaRightBound - qaCenterX, qaX));
      
      setQaWindowPosition({ x: finalQaX, y: qaY });
      setQaWindowSize({ width: qaWidth, height: qaHeight });
      const qaBounds = getQaBounds(
        currentWidth,
        currentHeight,
        { x: finalQaX, y: qaY },
        { width: qaWidth, height: qaHeight }
      );

      // Update input (centered element, needs special handling with left panel width)
      const savedInputWidth = savedPositions.input.width || 900;
      const inputWidth = isDefaultPreset
        ? Math.max(300, adaptiveCenterWidth)
        : getResponsiveSize(savedInputWidth, savedWindowSize, true, 300, centerAreaWidth);
      
      // Input 위치 계산: 저장된 위치를 기준으로 비율 조정
      const inputX = savedPositions.input.x * scaleX;
      const inputY = savedPositions.input.y * scaleY;
      
      // Input 필드가 화면 밖으로 나가지 않도록 제한
      const inputLeftBound = centerAreaLeft + inputWidth / 2;
      const inputRightBound = centerAreaRight - inputWidth / 2;
      const inputCenterX = centerAreaX;
      
      // 중앙에서의 오프셋을 유지하되, 경계를 넘지 않도록 조정
      const finalInputX = Math.max(inputLeftBound - inputCenterX, Math.min(inputRightBound - inputCenterX, inputX));
      
      setInputPosition({ x: finalInputX, y: inputY });
      setInputSize({ width: inputWidth });

      // Update memo pad (consider left panel width for better positioning)
      if (savedPositions.memoPad) {
        const memoPadPos = getResponsivePosition(
          savedPositions.memoPad, 
          savedWindowSize, 
          false,
          leftWidth, // current left panel width
          savedPositions.leftPanel.width // saved left panel width
        );
        const { width: memoPadWidth, height: memoPadHeight } = getMemoPadDimensions();
        const boundedMemoPadPos = {
          x: clampValue(memoPadPos.x, 20, Math.max(20, currentWidth - memoPadWidth - 20)),
          y: clampValue(memoPadPos.y, 20, Math.max(20, currentHeight - memoPadHeight - 20))
        };
        setMemoPadPosition(boundedMemoPadPos);
      }

      // Update memo windows to match responsive scaling
      setMemos((prevMemos) => {
        if (!prevMemos.length) return prevMemos;
        let hasChanges = false;
        const updatedMemos = prevMemos.map((memo) => {
          const baseWindow = memo.baseWindowSize || savedWindowSize;
          const baseSize = memo.baseSize || memo.size;
          const basePosition = memo.basePosition || memo.position;
          const scaleX = currentWidth / baseWindow.width;
          const scaleY = currentHeight / baseWindow.height;
          const minWidth = 220;
          const minHeight = 180;
          const maxWidth = Math.max(minWidth, currentWidth - 40);
          const maxHeight = Math.max(minHeight, currentHeight - 40);
          const nextWidth = clampValue(Math.round(baseSize.width * scaleX), minWidth, maxWidth);
          const nextHeight = clampValue(Math.round(baseSize.height * scaleY), minHeight, maxHeight);
          const nextX = clampValue(Math.round(basePosition.x * scaleX), 20, Math.max(20, currentWidth - nextWidth - 20));
          const nextY = clampValue(Math.round(basePosition.y * scaleY), 20, Math.max(20, currentHeight - nextHeight - 20));
          const adjustedPosition = getNonOverlappingPosition(
            { x: nextX, y: nextY },
            { width: nextWidth, height: nextHeight },
            qaBounds,
            { width: currentWidth, height: currentHeight }
          );
          if (
            memo.position?.x !== adjustedPosition.x ||
            memo.position?.y !== adjustedPosition.y ||
            memo.size?.width !== nextWidth ||
            memo.size?.height !== nextHeight
          ) {
            hasChanges = true;
            return {
              ...memo,
              position: { x: adjustedPosition.x, y: adjustedPosition.y },
              size: { width: nextWidth, height: nextHeight },
              baseWindowSize: baseWindow,
              baseSize,
              basePosition
            };
          }
          return memo;
        });
        return hasChanges ? updatedMemos : prevMemos;
      });
    };

    updatePositions();

    const handleResize = () => {
      // Debounce resize events for smoother performance
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updatePositions();
      }, 16); // ~60fps
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMounted, savedPositions]);

  // Handle left panel resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const newWidth = e.clientX - leftPanelPosition.x;
        if (newWidth >= 200 && newWidth <= 600) {
          setLeftPanelWidth(newWidth);
        }
      }
      if (isResizingVertical) {
        const deltaY = e.clientY - verticalResizeStart.y;
        const newHeight = verticalResizeStart.height + deltaY;
        const minHeight = isMinimized ? calculateMinimizedHeight() : 300;
        const maxHeight = typeof window !== 'undefined' ? window.innerHeight - leftPanelPosition.y : 800;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          setLeftPanelHeight(newHeight);
        }
      }
      if (isDraggingPanel) {
        const nextY = e.clientY - dragStart.y;
        const maxY = getChatBoundaryY() - leftPanelHeight;
        setLeftPanelPosition({
          x: e.clientX - dragStart.x,
          y: Math.max(0, Math.min(maxY, nextY))
        });
      }
      if (isResizingRight) {
        const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const newWidth = windowWidth - e.clientX - rightPanelPosition.x;
        if (newWidth >= 200 && newWidth <= 600) {
          setRightPanelWidth(newWidth);
        }
      }
      if (isResizingRightVertical) {
        const deltaY = e.clientY - rightVerticalResizeStart.y;
        const newHeight = rightVerticalResizeStart.height + deltaY;
        const minHeight = 300;
        const maxHeight = typeof window !== 'undefined' ? window.innerHeight - rightPanelPosition.y : 800;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          setRightPanelHeight(newHeight);
        }
      }
      if (isDraggingRightPanel) {
        const nextY = e.clientY - rightDragStart.y;
        const maxY = getChatBoundaryY() - rightPanelHeight;
        setRightPanelPosition({
          x: e.clientX - rightDragStart.x,
          y: Math.max(0, Math.min(maxY, nextY))
        });
      }
      if (isDraggingQaWindow) {
        const currentHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
        const maxQaY = getChatBoundaryY() - qaWindowSize.height / 2 - currentHeight / 2;
        const nextQaY = e.clientY - qaWindowDragStart.y;
        setQaWindowPosition({
          x: e.clientX - qaWindowDragStart.x,
          y: Math.min(maxQaY, nextQaY)
        });
      }
      if (isDraggingInput) {
        setInputPosition({
          x: e.clientX - inputDragStart.x,
          y: e.clientY - inputDragStart.y
        });
      }
      if (isDraggingDrawingArea) {
        setDrawingAreaPosition({
          x: e.clientX - drawingAreaDragStart.x,
          y: e.clientY - drawingAreaDragStart.y
        });
      }
      if (isSelectingCanvasItems) {
        const rect = getCanvasRect();
        if (rect) {
          const currentX = e.clientX - rect.left;
          const currentY = e.clientY - rect.top;
          setCanvasSelectionRect((prev) => {
            if (!prev) return null;
            const startX = prev.startX ?? prev.x;
            const startY = prev.startY ?? prev.y;
            const x = Math.min(startX, currentX);
            const y = Math.min(startY, currentY);
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            return { ...prev, x, y, width, height, startX, startY };
          });
        }
      }
      if (isDraggingCanvasItem && activeCanvasItemId) {
        const rect = getCanvasRect();
        if (rect) {
          setCanvasItems((prev) => {
            const draggedItem = prev.find((item) => item.id === activeCanvasItemId);
            if (!draggedItem) return prev;
            const nextX = e.clientX - rect.left - canvasItemDragStart.x;
            const nextY = e.clientY - rect.top - canvasItemDragStart.y;
            const clamped = clampCanvasPosition(nextX, nextY, draggedItem);
            const deltaX = clamped.x - draggedItem.x;
            const deltaY = clamped.y - draggedItem.y;

            const selectedIds =
              selectedCanvasItemIds && selectedCanvasItemIds.length
                ? selectedCanvasItemIds
                : [activeCanvasItemId];
            const selectedIdSet = new Set(selectedIds);

            let nextItems = prev.map((item) => {
              // 활성 아이템 이동
              if (item.id === activeCanvasItemId) {
                if (
                  item.type === 'line' &&
                  item.startX !== undefined &&
                  item.endX !== undefined &&
                  !item.fromId &&
                  !item.toId
                ) {
                  // 연결되지 않은 선은 전체 이동
                  return {
                    ...item,
                    x: clamped.x,
                    y: clamped.y,
                    startX: item.startX + deltaX,
                    endX: item.endX + deltaX,
                    startY: item.startY + deltaY,
                    endY: item.endY + deltaY
                  };
                }
                return { ...item, x: clamped.x, y: clamped.y };
              }

              // 함께 선택된 다른 도형 이동 (선, 화살표 제외)
              if (
                selectedIdSet.has(item.id) &&
                item.id !== activeCanvasItemId &&
                item.type !== 'line' &&
                item.type !== 'arrow'
              ) {
                const moved = clampCanvasPosition(item.x + deltaX, item.y + deltaY, item);
                return { ...item, x: moved.x, y: moved.y };
              }

              return item;
            });

            // 선택된 도형과 연결된 선들 업데이트
            nextItems = nextItems.map((item) => {
              if (
                item.type === 'line' &&
                ((item.fromId && selectedIdSet.has(item.fromId)) ||
                  (item.toId && selectedIdSet.has(item.toId)))
              ) {
                const endpoints = getLineEndpoints(item, nextItems);
                if (endpoints) {
                  const normalized = normalizeLineItem(
                    endpoints.start.x,
                    endpoints.start.y,
                    endpoints.end.x,
                    endpoints.end.y,
                    item.strokeWidth || 3
                  );
                  return { ...item, ...normalized };
                }
              }
              return item;
            });

            return nextItems;
          });
        }
      }
      if (isResizingCanvasItem && canvasResizeStart.id) {
        const rect = getCanvasRect();
        if (!rect) return;
        setCanvasItems((prev) =>
          prev.map((item) => {
            if (item.id !== canvasResizeStart.id) {
              // 연결된 선 업데이트
              if (item.type === 'line' && (item.fromId === canvasResizeStart.id || item.toId === canvasResizeStart.id)) {
                // 리사이즈 중인 아이템의 새 위치를 반영하여 선 끝점 계산
                const resizingItem = prev.find((i) => i.id === canvasResizeStart.id);
                if (resizingItem) {
                  const deltaX = e.clientX - canvasResizeStart.mouseX;
                  const deltaY = e.clientY - canvasResizeStart.mouseY;
                  let nextX = canvasResizeStart.x;
                  let nextY = canvasResizeStart.y;
                  let nextWidth = canvasResizeStart.width;
                  let nextHeight = canvasResizeStart.height;
                  if (canvasResizeStart.handle.includes('e')) {
                    nextWidth = canvasResizeStart.width + deltaX;
                  }
                  if (canvasResizeStart.handle.includes('s')) {
                    nextHeight = canvasResizeStart.height + deltaY;
                  }
                  if (canvasResizeStart.handle.includes('w')) {
                    nextWidth = canvasResizeStart.width - deltaX;
                    nextX = canvasResizeStart.x + deltaX;
                  }
                  if (canvasResizeStart.handle.includes('n')) {
                    nextHeight = canvasResizeStart.height - deltaY;
                    nextY = canvasResizeStart.y + deltaY;
                  }
                  const minSize = resizingItem.type === 'text' ? 80 : 40;
                  nextWidth = Math.max(minSize, snapValue(nextWidth));
                  nextHeight = Math.max(minSize, snapValue(nextHeight));
                  const clamped = clampCanvasPosition(nextX, nextY, { ...resizingItem, width: nextWidth, height: nextHeight });
                  const updatedItems = prev.map((i) => i.id === canvasResizeStart.id ? { ...i, ...clamped, width: nextWidth, height: nextHeight } : i);
                  const endpoints = getLineEndpoints(item, updatedItems);
                  if (endpoints) {
                    const normalized = normalizeLineItem(endpoints.start.x, endpoints.start.y, endpoints.end.x, endpoints.end.y);
                    return { ...item, ...normalized };
                  }
                } else {
                  const endpoints = getLineEndpoints(item, prev);
                  if (endpoints) {
                    const normalized = normalizeLineItem(endpoints.start.x, endpoints.start.y, endpoints.end.x, endpoints.end.y);
                    return { ...item, ...normalized };
                  }
                }
              }
              return item;
            }
            const deltaX = e.clientX - canvasResizeStart.mouseX;
            const deltaY = e.clientY - canvasResizeStart.mouseY;
            let nextX = canvasResizeStart.x;
            let nextY = canvasResizeStart.y;
            let nextWidth = canvasResizeStart.width;
            let nextHeight = canvasResizeStart.height;
            if (canvasResizeStart.handle.includes('e')) {
              nextWidth = canvasResizeStart.width + deltaX;
            }
            if (canvasResizeStart.handle.includes('s')) {
              nextHeight = canvasResizeStart.height + deltaY;
            }
            if (canvasResizeStart.handle.includes('w')) {
              nextWidth = canvasResizeStart.width - deltaX;
              nextX = canvasResizeStart.x + deltaX;
            }
            if (canvasResizeStart.handle.includes('n')) {
              nextHeight = canvasResizeStart.height - deltaY;
              nextY = canvasResizeStart.y + deltaY;
            }
            const minSize = item.type === 'text' ? 80 : 40;
            nextWidth = Math.max(minSize, snapValue(nextWidth));
            nextHeight = Math.max(minSize, snapValue(nextHeight));
            const clamped = clampCanvasPosition(nextX, nextY, { ...item, width: nextWidth, height: nextHeight });
            return {
              ...item,
              x: clamped.x,
              y: clamped.y,
              width: nextWidth,
              height: nextHeight
            };
          })
        );
      }
      if (isDraggingMemoPad) {
        setMemoPadPosition({
          x: e.clientX - memoPadDragStart.x,
          y: e.clientY - memoPadDragStart.y
        });
      }
      if (linkDrag) {
        const point = getCanvasPoint(e);
        if (point) {
          const snapped = getNearestPortMatch(point);
          setCanvasLinks((prev) =>
            prev.map((link) => {
              if (link.id !== linkDrag.id) return link;
              const endpoints = getLinkEndpoints(link);
              if (!endpoints) return link;
              const { start, end } = endpoints;
              if (linkDrag.type === 'from') {
                if (snapped) {
                  return {
                    ...link,
                    fromId: snapped.id,
                    fromPort: snapped.port,
                    fromPoint: null
                  };
                }
                return {
                  ...link,
                  fromId: null,
                  fromPort: null,
                  fromPoint: { x: snapValue(point.x), y: snapValue(point.y) }
                };
              }
              if (linkDrag.type === 'to') {
                if (snapped) {
                  return {
                    ...link,
                    toId: snapped.id,
                    toPort: snapped.port,
                    toPoint: null
                  };
                }
                return {
                  ...link,
                  toId: null,
                  toPort: null,
                  toPoint: { x: snapValue(point.x), y: snapValue(point.y) }
                };
              }
              if (linkDrag.type === 'bend') {
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const horizontal = Math.abs(dx) >= Math.abs(dy);
                if (horizontal) {
                  return {
                    ...link,
                    bend: { x: snapValue(point.x), y: link.bend?.y ?? start.y }
                  };
                }
                return {
                  ...link,
                  bend: { x: link.bend?.x ?? start.x, y: snapValue(point.y) }
                };
              }
              return link;
            })
          );
          setActiveCanvasLinkId(linkDrag.id);
        }
      }
      if (lineDrag) {
        const point = getCanvasPoint(e);
        if (point) {
          const snapped = getNearestPortMatch(point);
          setCanvasItems((prev) =>
            prev.map((item) => {
              if (item.id !== lineDrag.id) return item;
              if (lineDrag.handle === 'start') {
                if (snapped) {
                  // 연결 정보 저장
                  const updatedItem = { ...item, fromId: snapped.id, fromPort: snapped.port };
                  const endpoints = getLineEndpoints(updatedItem, prev);
                  const endPoint = endpoints ? endpoints.end : { x: item.endX ?? item.x + item.width, y: item.endY ?? item.y + item.height };
                  const normalized = normalizeLineItem(snapped.point.x, snapped.point.y, endPoint.x, endPoint.y, item.strokeWidth || 3);
                  return {
                    ...item,
                    ...normalized,
                    fromId: snapped.id,
                    fromPort: snapped.port,
                    fromPoint: null
                  };
                } else {
                  // 연결 해제
                  const targetPoint = { x: snapValue(point.x), y: snapValue(point.y) };
                  const normalized = normalizeLineItem(targetPoint.x, targetPoint.y, item.endX ?? item.x + item.width, item.endY ?? item.y + item.height, item.strokeWidth || 3);
                  return {
                    ...item,
                    ...normalized,
                    fromId: null,
                    fromPort: null,
                    fromPoint: null
                  };
                }
              } else {
                if (snapped) {
                  // 연결 정보 저장
                  const updatedItem = { ...item, toId: snapped.id, toPort: snapped.port };
                  const endpoints = getLineEndpoints(updatedItem, prev);
                  const startPoint = endpoints ? endpoints.start : { x: item.startX ?? item.x, y: item.startY ?? item.y };
                  const normalized = normalizeLineItem(startPoint.x, startPoint.y, snapped.point.x, snapped.point.y, item.strokeWidth || 3);
                  return {
                    ...item,
                    ...normalized,
                    toId: snapped.id,
                    toPort: snapped.port,
                    toPoint: null
                  };
                } else {
                  // 연결 해제
                  const targetPoint = { x: snapValue(point.x), y: snapValue(point.y) };
                  const normalized = normalizeLineItem(item.startX ?? item.x, item.startY ?? item.y, targetPoint.x, targetPoint.y, item.strokeWidth || 3);
                  return {
                    ...item,
                    ...normalized,
                    toId: null,
                    toPort: null,
                    toPoint: null
                  };
                }
              }
            })
          );
          setActiveCanvasItemId(lineDrag.id);
        }
      }
      if (lineDraft) {
        const point = getCanvasPoint(e);
        if (point) {
          let endX = snapValue(point.x);
          let endY = snapValue(point.y);
          const deltaX = endX - lineDraft.startX;
          const deltaY = endY - lineDraft.startY;
          if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            endY = lineDraft.startY;
          } else {
            endX = lineDraft.startX;
          }
          const nextX = Math.min(lineDraft.startX, endX);
          const nextY = Math.min(lineDraft.startY, endY);
          const nextWidth = Math.abs(endX - lineDraft.startX);
          const nextHeight = Math.abs(endY - lineDraft.startY);
          setLineDraft((prev) =>
            prev
              ? {
                  ...prev,
                  endX,
                  endY,
                  x: nextX,
                  y: nextY,
                  width: nextWidth,
                  height: nextHeight
                }
              : prev
          );
        }
      }
      if (draggingMemo) {
        const currentWindowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const currentWindowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
        const qaBounds = getQaBounds(
          currentWindowWidth,
          currentWindowHeight,
          qaWindowPosition,
          qaWindowSize
        );
        setMemos((prevMemos) =>
          prevMemos.map((m) => {
            if (m.id !== draggingMemo) return m;
            const baseWindow = m.baseWindowSize || savedPositions.windowSize || { width: currentWindowWidth, height: currentWindowHeight };
            const scaleX = currentWindowWidth / baseWindow.width;
            const scaleY = currentWindowHeight / baseWindow.height;
            const nextPosition = {
              x: e.clientX - memoDragStart.x,
              y: e.clientY - memoDragStart.y
            };
            const adjustedPosition = getNonOverlappingPosition(
              nextPosition,
              m.size,
              qaBounds,
              { width: currentWindowWidth, height: currentWindowHeight }
            );
            const nextBasePosition = {
              x: Math.round(adjustedPosition.x / scaleX),
              y: Math.round(adjustedPosition.y / scaleY)
            };
            return {
              ...m,
              position: adjustedPosition,
              basePosition: nextBasePosition,
              baseWindowSize: baseWindow
            };
          })
        );
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsResizingVertical(false);
      setIsDraggingPanel(false);
      setIsResizingRight(false);
      setIsResizingRightVertical(false);
      setIsDraggingRightPanel(false);
      setIsDraggingQaWindow(false);
      setIsDraggingInput(false);
      setIsDraggingDrawingArea(false);
      setIsDraggingCanvasItem(false);
      setIsResizingCanvasItem(false);
      if (isSelectingCanvasItems) {
        setIsSelectingCanvasItems(false);
        if (canvasSelectionRect) {
          const { x, y, width, height } = canvasSelectionRect;
          if (width > 0 && height > 0) {
            const selectedIds = canvasItems
              .filter((item) => {
                const itemLeft = item.x;
                const itemRight = item.x + item.width;
                const itemTop = item.y;
                const itemBottom = item.y + item.height;
                // 선택 박스와 도형/선/화살표가 조금이라도 겹치면 선택
                const intersects =
                  itemRight >= x &&
                  itemLeft <= x + width &&
                  itemBottom >= y &&
                  itemTop <= y + height;
                return intersects;
              })
              .map((item) => item.id);

            if (selectedIds.length) {
              setSelectedCanvasItemIds(selectedIds);
              setActiveCanvasItemId(selectedIds[0] ?? null);

              // 그룹 모드인 경우: 선택된 도형들로 새 그룹 생성
              if (isGroupMode) {
                pushCanvasHistory();
                const newGroup = {
                  id: Date.now() + Math.random(),
                  itemIds: selectedIds
                };
                setCanvasGroups((prev) => [...prev, newGroup]);
                setActiveCanvasGroupId(newGroup.id);
              }
            }
          }
        }
        setCanvasSelectionRect(null);
        if (isGroupMode) {
          setIsGroupMode(false);
        }
      }
      setIsDraggingMemoPad(false);
      setDraggingMemo(null);
      setLinkDrag(null);
      setLineDrag(null);
      if (lineDraft) {
        finalizeLineDraft();
      }
    };

    if (isResizing || isResizingVertical || isDraggingPanel || isResizingRight || isResizingRightVertical || isDraggingRightPanel || isDraggingQaWindow || isDraggingInput || isDraggingDrawingArea || isDraggingCanvasItem || isResizingCanvasItem || isDraggingMemoPad || draggingMemo || lineDraft || linkDrag || lineDrag || isSelectingCanvasItems) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, isResizingVertical, isDraggingPanel, dragStart, leftPanelPosition, isMinimized, verticalResizeStart, leftPanelHeight, isResizingRight, isResizingRightVertical, isDraggingRightPanel, rightVerticalResizeStart, rightPanelHeight, rightPanelPosition, rightDragStart, isDraggingQaWindow, qaWindowDragStart, qaWindowPosition, isDraggingInput, inputDragStart, inputPosition, isDraggingDrawingArea, drawingAreaDragStart, drawingAreaPosition, isDraggingCanvasItem, activeCanvasItemId, canvasItemDragStart, isResizingCanvasItem, canvasResizeStart, isDraggingMemoPad, memoPadDragStart, memoPadPosition, draggingMemo, memoDragStart, memos, savedPositions, snapToGrid, gridSize, lineDraft, linkDrag, lineDrag, canvasLinks, isSelectingCanvasItems, canvasSelectionRect, canvasItems, selectedCanvasItemIds]);

  // Handle toolbar drag
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingToolbar) {
        setToolbarPosition({
          x: e.clientX - toolbarDragStart.x,
          y: e.clientY - toolbarDragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingToolbar(false);
    };

    if (isDraggingToolbar) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingToolbar, toolbarDragStart]);

  // Canvas undo/redo, copy/paste (Ctrl+Z / Ctrl+Y / Ctrl+C / Ctrl+V)
  useEffect(() => {
    let canvasClipboard = null;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // Ctrl/Meta 조합만 처리
      if (!(e.ctrlKey || e.metaKey)) return;

      // Undo: Ctrl+Z
      if (!e.shiftKey && key === 'z') {
        const history = canvasHistoryRef.current;
        if (!history.length) return;
        e.preventDefault();

        // 현재 상태를 redo 스택에 저장
        const currentSnapshot = {
          items: JSON.parse(JSON.stringify(canvasItems)),
          links: JSON.parse(JSON.stringify(canvasLinks)),
          groups: JSON.parse(JSON.stringify(canvasGroups))
        };
        canvasRedoHistoryRef.current.push(currentSnapshot);

        const last = history.pop();
        if (!last) return;
        isUndoingCanvasRef.current = true;
        setCanvasItems(last.items || []);
        setCanvasLinks(last.links || []);
        setCanvasGroups(last.groups || []);
        setActiveCanvasItemId(null);
        setActiveCanvasLinkId(null);
        setActiveCanvasGroupId(null);
        setSelectedCanvasItemIds([]);
        setLineDraft(null);
        setLinkDrag(null);
        setLineDrag(null);
        isUndoingCanvasRef.current = false;
        return;
      }

      // Redo: Ctrl+Y 또는 Ctrl+Shift+Z
      if (key === 'y' || (e.shiftKey && key === 'z')) {
        const redoStack = canvasRedoHistoryRef.current;
        if (!redoStack.length) return;
        e.preventDefault();

        // 현재 상태를 undo 스택에 저장
        const currentSnapshot = {
          items: JSON.parse(JSON.stringify(canvasItems)),
          links: JSON.parse(JSON.stringify(canvasLinks)),
          groups: JSON.parse(JSON.stringify(canvasGroups))
        };
        canvasHistoryRef.current.push(currentSnapshot);

        const next = redoStack.pop();
        if (!next) return;
        isUndoingCanvasRef.current = true;
        setCanvasItems(next.items || []);
        setCanvasLinks(next.links || []);
        setCanvasGroups(next.groups || []);
        setActiveCanvasItemId(null);
        setActiveCanvasLinkId(null);
        setActiveCanvasGroupId(null);
        setSelectedCanvasItemIds([]);
        setLineDraft(null);
        setLinkDrag(null);
        setLineDrag(null);
        isUndoingCanvasRef.current = false;
        return;
      }

      // Copy: Ctrl+C
      if (key === 'c') {
        if (!canvasItems.length) return;
        const targetIds =
          selectedCanvasItemIds && selectedCanvasItemIds.length
            ? selectedCanvasItemIds
            : activeCanvasItemId
              ? [activeCanvasItemId]
              : [];
        if (!targetIds.length) return;
        e.preventDefault();

        const idSet = new Set(targetIds);
        const itemsToCopy = canvasItems.filter(
          (item) =>
            idSet.has(item.id) &&
            item.type !== 'line' &&
            item.type !== 'arrow'
        );
        if (!itemsToCopy.length) return;

        const linksToCopy = canvasLinks.filter(
          (link) => idSet.has(link.fromId) && idSet.has(link.toId)
        );

        canvasClipboard = {
          items: JSON.parse(JSON.stringify(itemsToCopy)),
          links: JSON.parse(JSON.stringify(linksToCopy))
        };
        return;
      }

      // Paste: Ctrl+V
      if (key === 'v') {
        if (!canvasClipboard || !canvasClipboard.items?.length) return;
        e.preventDefault();

        pushCanvasHistory();

        // 새 ID 매핑 생성
        const idMap = new Map();
        canvasClipboard.items.forEach((item) => {
          idMap.set(item.id, Date.now() + Math.random());
        });

        const offset = 24; // 살짝 옆으로 복사

        const newItems = canvasClipboard.items.map((item) => ({
          ...item,
          id: idMap.get(item.id),
          x: snapValue(item.x + offset),
          y: snapValue(item.y + offset)
        }));

        const newLinks = (canvasClipboard.links || []).map((link) => {
          const fromId = idMap.get(link.fromId);
          const toId = idMap.get(link.toId);
          if (!fromId || !toId) return null;
          return {
            ...link,
            id: Date.now() + Math.random(),
            fromId,
            toId
          };
        }).filter(Boolean);

        setCanvasItems((prev) => [...prev, ...newItems]);
        setCanvasLinks((prev) => [...prev, ...newLinks]);
        const newIds = newItems.map((i) => i.id);
        setSelectedCanvasItemIds(newIds);
        setActiveCanvasItemId(newIds[0] ?? null);
        setActiveCanvasLinkId(null);
        return;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [canvasItems, canvasLinks, canvasGroups, selectedCanvasItemIds, activeCanvasItemId]);

  const handleResizeStart = (e) => {
    if (!isCustomMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleVerticalResizeStart = (e) => {
    if (!isCustomMode) return;
    e.preventDefault();
    e.stopPropagation();
    setVerticalResizeStart({
      y: e.clientY,
      height: leftPanelHeight
    });
    setIsResizingVertical(true);
  };

  const handleRightResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingRight(true);
  };

  const handleRightVerticalResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRightVerticalResizeStart({
      y: e.clientY,
      height: rightPanelHeight
    });
    setIsResizingRightVertical(true);
  };

  const handleRightPanelDragStart = (e) => {
    if (!isCustomMode || e.target === rightResizeHandleRef.current || e.target === rightVerticalResizeHandleRef.current) return;
    setIsDraggingRightPanel(true);
    setRightDragStart({
      x: e.clientX - rightPanelPosition.x,
      y: e.clientY - rightPanelPosition.y
    });
  };

  const handleQaWindowDragStart = (e) => {
    if (!isCustomMode) return;
    setIsDraggingQaWindow(true);
    setQaWindowDragStart({
      x: e.clientX - qaWindowPosition.x,
      y: e.clientY - qaWindowPosition.y
    });
  };

  const handleInputDragStart = (e) => {
    if (!isCustomMode) return;
    setIsDraggingInput(true);
    setInputDragStart({
      x: e.clientX - inputPosition.x,
      y: e.clientY - inputPosition.y
    });
  };

  const handleDrawingAreaDragStart = (e) => {
    if (!isCustomMode) return;
    setIsDraggingDrawingArea(true);
    setDrawingAreaDragStart({
      x: e.clientX - drawingAreaPosition.x,
      y: e.clientY - drawingAreaPosition.y
    });
  };
  
  const handleMemoPadDragStart = (e) => {
    if (!isCustomMode) return;
    setIsDraggingMemoPad(true);
    setMemoPadDragStart({
      x: e.clientX - memoPadPosition.x,
      y: e.clientY - memoPadPosition.y
    });
  };
  
  const handleCustomModeToggle = () => {
    if (!isCustomMode) {
      // 커스텀 모드 시작 시 현재 위치 저장
      setCustomModeStartPositions({
        leftPanel: { x: leftPanelPosition.x, y: leftPanelPosition.y, width: leftPanelWidth, height: leftPanelHeight },
        rightPanel: { x: rightPanelPosition.x, y: rightPanelPosition.y, width: rightPanelWidth, height: rightPanelHeight },
        toolbar: { x: toolbarPosition.x, y: toolbarPosition.y },
        qaWindow: { x: qaWindowPosition.x, y: qaWindowPosition.y, width: qaWindowSize.width, height: qaWindowSize.height },
        input: { x: inputPosition.x, y: inputPosition.y, width: inputSize.width },
        drawingArea: { x: drawingAreaPosition.x, y: drawingAreaPosition.y },
        memoPad: { x: memoPadPosition.x, y: memoPadPosition.y }
      });
    }
    setIsCustomMode(!isCustomMode);
  };
  
  const handleSavePositions = () => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    const positions = {
      leftPanel: {
        x: leftPanelPosition.x,
        y: leftPanelPosition.y,
        width: leftPanelWidth,
        height: leftPanelHeight
      },
      rightPanel: {
        x: rightPanelPosition.x,
        y: rightPanelPosition.y,
        width: rightPanelWidth,
        height: rightPanelHeight
      },
      toolbar: {
        x: toolbarPosition.x,
        y: toolbarPosition.y
      },
      qaWindow: {
        x: qaWindowPosition.x,
        y: qaWindowPosition.y,
        width: qaWindowSize.width,
        height: qaWindowSize.height
      },
      input: {
        x: inputPosition.x,
        y: inputPosition.y,
        width: inputSize.width
      },
      drawingArea: {
        x: drawingAreaPosition.x,
        y: drawingAreaPosition.y
      },
      memoPad: {
        x: memoPadPosition.x,
        y: memoPadPosition.y,
        anchor: 'left'
      },
      windowSize: {
        width: windowWidth,
        height: windowHeight
      }
    };
    setSavedPositions(positions);
    localStorage.setItem('aillmPositions', JSON.stringify(positions));
    setIsCustomMode(false);
    setCustomModeStartPositions(null);
    alert('위치가 저장되었습니다.');
  };
  
  const handleCancelCustomMode = () => {
    if (!customModeStartPositions) return;
    
    // 커스텀 모드 시작 시점의 위치로 되돌리기
    setLeftPanelPosition({ x: customModeStartPositions.leftPanel.x, y: customModeStartPositions.leftPanel.y });
    setLeftPanelWidth(customModeStartPositions.leftPanel.width);
    setLeftPanelHeight(customModeStartPositions.leftPanel.height);
    setRightPanelPosition({ x: customModeStartPositions.rightPanel.x, y: customModeStartPositions.rightPanel.y });
    setRightPanelWidth(customModeStartPositions.rightPanel.width);
    setRightPanelHeight(customModeStartPositions.rightPanel.height);
    setToolbarPosition({ x: customModeStartPositions.toolbar.x, y: customModeStartPositions.toolbar.y });
    setQaWindowPosition({ x: customModeStartPositions.qaWindow.x, y: customModeStartPositions.qaWindow.y });
    if (customModeStartPositions.qaWindow.width && customModeStartPositions.qaWindow.height) {
      setQaWindowSize({ width: customModeStartPositions.qaWindow.width, height: customModeStartPositions.qaWindow.height });
    }
    setInputPosition({ x: customModeStartPositions.input.x, y: customModeStartPositions.input.y });
    if (customModeStartPositions.input.width) {
      setInputSize({ width: customModeStartPositions.input.width });
    }
    if (customModeStartPositions.drawingArea) {
      setDrawingAreaPosition({ x: customModeStartPositions.drawingArea.x, y: customModeStartPositions.drawingArea.y });
    }
    setMemoPadPosition({ x: customModeStartPositions.memoPad.x, y: customModeStartPositions.memoPad.y });
    
    setIsCustomMode(false);
    setCustomModeStartPositions(null);
  };
  
  const calculateMinimizedHeight = () => {
    // Header: ~72px, Search: ~68px, 3 items: ~132px (44px each), padding: ~24px
    return 72 + 68 + 132 + 24;
  };

  const handleMinimizeToggle = () => {
    if (isMinimized) {
      // Restore to previous height or default
      const restoreHeight = typeof window !== 'undefined' 
        ? window.innerHeight - leftPanelPosition.y 
        : 800;
      setLeftPanelHeight(restoreHeight);
      setIsMinimized(false);
    } else {
      // Minimize to show only 3 items
      const minimizedHeight = calculateMinimizedHeight();
      setLeftPanelHeight(minimizedHeight);
      setIsMinimized(true);
    }
  };

  const handlePanelDragStart = (e) => {
    if (!isCustomMode || e.target === resizeHandleRef.current) return;
    setIsDraggingPanel(true);
    setDragStart({
      x: e.clientX - leftPanelPosition.x,
      y: e.clientY - leftPanelPosition.y
    });
  };

  const handleToolbarDragStart = (e) => {
    if (!isCustomMode) return;
    setIsDraggingToolbar(true);
    setToolbarDragStart({
      x: e.clientX - toolbarPosition.x,
      y: e.clientY - toolbarPosition.y
    });
  };

  const handleNewConversation = () => {
    const newId = conversations.length + 1;
    setConversations([
      ...conversations,
      { id: newId, title: `대화목록${newId}`, lastMessage: '' }
    ]);
  };
  
  const handleAddMemo = () => {
    const newId = memos.length > 0 ? Math.max(...memos.map(m => m.id), 0) + 1 : 1;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const basePosition = {
      x: (windowWidth - 300) / 2 + (memos.length * 30),
      y: (windowHeight - 250) / 2 + (memos.length * 30)
    };
    const baseSize = { width: 300, height: 250 };
    const qaBounds = getQaBounds(
      windowWidth,
      windowHeight,
      qaWindowPosition,
      qaWindowSize
    );
    const adjustedPosition = getNonOverlappingPosition(
      basePosition,
      baseSize,
      qaBounds,
      { width: windowWidth, height: windowHeight }
    );
    setMemos([...memos, { 
      id: newId, 
      title: `메모 ${newId}`, 
      content: '',
      position: adjustedPosition,
      size: baseSize,
      basePosition: adjustedPosition,
      baseSize,
      baseWindowSize: { width: windowWidth, height: windowHeight }
    }]);
  };

  const getCurrentPositions = () => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    return normalizePositions({
      leftPanel: {
        x: leftPanelPosition.x,
        y: leftPanelPosition.y,
        width: leftPanelWidth,
        height: leftPanelHeight
      },
      rightPanel: {
        x: rightPanelPosition.x,
        y: rightPanelPosition.y,
        width: rightPanelWidth,
        height: rightPanelHeight
      },
      toolbar: {
        x: toolbarPosition.x,
        y: toolbarPosition.y
      },
      qaWindow: {
        x: qaWindowPosition.x,
        y: qaWindowPosition.y,
        width: qaWindowSize.width,
        height: qaWindowSize.height
      },
      input: {
        x: inputPosition.x,
        y: inputPosition.y,
        width: inputSize.width
      },
      drawingArea: {
        x: drawingAreaPosition.x,
        y: drawingAreaPosition.y
      },
      memoPad: {
        x: memoPadPosition.x,
        y: memoPadPosition.y,
        anchor: 'left'
      },
      windowSize: {
        width: windowWidth,
        height: windowHeight
      }
    });
  };

  const getSampleTemplates = () => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const base = normalizePositions({
      leftPanel: { x: 0, y: 0, width: 320, height: windowHeight },
      rightPanel: { x: 0, y: 0, width: 320, height: windowHeight },
      toolbar: { x: 20, y: 20 },
      qaWindow: { x: 0, y: 0, width: 900, height: 600 },
      input: { x: 0, y: 0, width: 900 },
      drawingArea: { x: 0, y: 0 },
      memoPad: { x: memoPadPosition.x, y: memoPadPosition.y, anchor: 'left' },
      windowSize: { width: windowWidth, height: windowHeight }
    });
    return [
      { id: 'default', name: '기본 레이아웃', positions: base },
      {
        id: 'wide-qa',
        name: '넓은 Q&A',
        positions: {
          ...base,
          qaWindow: {
            ...base.qaWindow,
            width: Math.min(1100, windowWidth - base.leftPanel.width - 80),
            height: 620
          },
          input: {
            ...base.input,
            width: Math.min(1100, windowWidth - base.leftPanel.width - 80)
          }
        }
      }
    ];
  };

  const handleSaveTemplate = () => {
    const name = templateName.trim();
    if (!name) return;
    const positions = getCurrentPositions();
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const templateWindowSize = { width: windowWidth, height: windowHeight };
    const memosForTemplate = memos.map((memo) =>
      normalizeMemoForTemplate(memo, templateWindowSize)
    );
    const newTemplate = {
      id: Date.now(),
      name,
      positions,
      memos: memosForTemplate,
      createdAt: new Date().toISOString()
    };
    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('aillmTemplates', JSON.stringify(updatedTemplates));
    setTemplateName('');
  };

  const handleApplyTemplate = (template) => {
    const normalized = normalizePositions({
      ...template.positions,
      presetId: template.id
    });
    applyPositions(normalized);
    localStorage.setItem('aillmPositions', JSON.stringify(normalized));
    if (template.memos) {
      const normalizedMemos = template.memos.map((memo) =>
        normalizeMemoForTemplate(memo, normalized.windowSize)
      );
      setMemos(normalizedMemos);
      localStorage.setItem('aillmMemos', JSON.stringify(normalizedMemos));
    }
    setIsTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (templateId) => {
    const updatedTemplates = savedTemplates.filter((template) => template.id !== templateId);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('aillmTemplates', JSON.stringify(updatedTemplates));
  };
  
  const handleDeleteMemo = (id) => {
    setMemos(memos.filter(m => m.id !== id));
  };
  
  const handleMemoContentChange = (id, content) => {
    setMemos(memos.map(m => m.id === id ? { ...m, content } : m));
  };

  const handleTextModalApply = () => {
    // 표 셀 편집인 경우
    if (textModalTableTarget) {
      const { tableId, row, col } = textModalTableTarget;

      // 리치텍스트 HTML 전체를 그대로 저장해서 색상/스타일을 유지
      const html = (textModalContent || '').trim();

      pushCanvasHistory();
      setCanvasItems((prev) =>
        prev.map((c) => {
          if (c.id !== tableId || c.type !== 'table') return c;
          const rows = c.rows || 1;
          const cols = c.cols || 1;
          const baseCells =
            Array.isArray(c.cells) && c.cells.length === rows
              ? c.cells.map((r) =>
                  Array.isArray(r)
                    ? [...r, ...Array(Math.max(0, cols - r.length)).fill('')]
                    : Array(cols).fill('')
                )
              : Array.from({ length: rows }, () => Array(cols).fill(''));
          const nextCells = baseCells.map((r) => [...r]);
          nextCells[row][col] = html;
          return {
            ...c,
            cells: nextCells
          };
        })
      );
      setIsTextModalOpen(false);
      setTextModalTargetId(null);
      setTextModalTableTarget(null);
      return;
    }

    // 일반 텍스트/도형 편집인 경우
    if (!textModalTargetId) {
      setIsTextModalOpen(false);
      return;
    }
    pushCanvasHistory();
    setCanvasItems((prev) =>
      prev.map((c) => (c.id === textModalTargetId ? { ...c, text: textModalContent } : c))
    );
    setIsTextModalOpen(false);
    setTextModalTargetId(null);
  };
  
  const handleMemoTitleChange = (id, title) => {
    setMemos(memos.map(m => m.id === id ? { ...m, title } : m));
  };
  
  const handleMemoDragStart = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const memo = memos.find(m => m.id === id);
    if (memo) {
      setDraggingMemo(id);
      setMemoDragStart({
        x: e.clientX - memo.position.x,
        y: e.clientY - memo.position.y
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeCanvasItemId && !activeCanvasLinkId) return;
      const tagName = document.activeElement?.tagName;
      const isEditingField = tagName === 'INPUT' || tagName === 'TEXTAREA';
      if (e.key === 'Delete' && !isEditingField) {
        e.preventDefault();
        handleDeleteActiveCanvasItem();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateActiveCanvasItem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCanvasItemId, canvasItems]);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sampleTemplates = getSampleTemplates();

  const headerActions = (
    <>
      <button className={styles.headerButton}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span>문의하기</span>
      </button>
      <button className={styles.headerButton}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span>알림 0</span>
      </button>
    </>
  );

  return (
    <AppShell styles={styles} title="AI-LLM 대화방" activeNav="aillm" headerActions={headerActions}>
    <div className={styles.container}>
      <section className={styles.chatSection}>
      {/* Left Panel - Conversation List */}
      <aside
        ref={leftPanelRef}
        className={`${styles.leftPanel} ${isCustomMode ? styles.draggable : ''}`}
        style={{
          width: `${leftPanelWidth}px`,
          height: `${leftPanelHeight}px`,
          transform: `translate(${leftPanelPosition.x}px, ${leftPanelPosition.y}px)`
        }}
        onMouseDown={handlePanelDragStart}
      >
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>대화목록</h2>
          <div className={styles.headerButtons}>
            <button
              className={styles.minimizeBtn}
              onClick={handleMinimizeToggle}
              aria-label={isMinimized ? "확장" : "최소화"}
              title={isMinimized ? "확장" : "최소화"}
            >
              {isMinimized ? '□' : '−'}
            </button>
            <button
              className={styles.newConversationBtn}
              onClick={handleNewConversation}
              aria-label="새 대화 시작"
            >
              +
            </button>
          </div>
        </div>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="검색으로 찾을 수 있게"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.conversationList}>
          {(isMinimized ? filteredConversations.slice(0, 3) : filteredConversations).map((conv) => (
            <div
              key={conv.id}
              className={`${styles.conversationItem} ${
                activeConversation === conv.id ? styles.active : ''
              }`}
              onClick={() => setActiveConversation(conv.id)}
            >
              {conv.title}
            </div>
          ))}
        </div>

        {/* Horizontal Resize Handle - Only visible in custom mode */}
        {isCustomMode && (
          <div
            ref={resizeHandleRef}
            className={styles.resizeHandle}
            onMouseDown={handleResizeStart}
          />
        )}
        
        {/* Vertical Resize Handle - Only visible in custom mode */}
        {isCustomMode && (
          <div
            ref={verticalResizeHandleRef}
            className={styles.verticalResizeHandle}
            onMouseDown={handleVerticalResizeStart}
          />
        )}
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Draggable Toolbar */}
        <div
          ref={toolbarRef}
          className={styles.toolbar}
          style={{
            transform: `translate(${toolbarPosition.x}px, ${toolbarPosition.y}px)`
          }}
          onMouseDown={handleToolbarDragStart}
        >
          <div className={styles.memoPadButton}>
            <span className={styles.memoPadButtonText}>메모장</span>
            <button
              className={styles.memoPadAddBtn}
              onClick={handleAddMemo}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="새 메모 추가"
            >
              +
            </button>
          </div>
          <button className={styles.toolbarBtn}>api</button>
          <button className={styles.toolbarBtn}>사용중인모드</button>
          <button className={styles.toolbarBtn}>mcp</button>
          <button className={styles.toolbarBtn}>RPA연동</button>
          <button 
            className={`${styles.toolbarBtn} ${isCustomMode ? styles.customModeActive : ''}`}
            onClick={handleCustomModeToggle}
          >
            화면커스텀
          </button>
          <button 
            className={styles.toolbarBtn}
            onClick={() => setIsTemplateModalOpen(true)}
          >
            화면 템플릿
          </button>
          {isCustomMode && (
            <>
              <button 
                className={`${styles.toolbarBtn} ${styles.saveBtn}`}
                onClick={handleSavePositions}
              >
                저장
              </button>
              <button 
                className={`${styles.toolbarBtn} ${styles.cancelBtn}`}
                onClick={handleCancelCustomMode}
              >
                취소
              </button>
            </>
          )}
        </div>
      </main>

      {/* Q&A Window - Fixed Position */}
      <div
        ref={qaWindowRef}
        className={`${styles.qaWindow} ${isCustomMode ? styles.draggable : ''}`}
        style={{
          '--qa-x': `${qaWindowPosition.x}px`,
          '--qa-y': `${qaWindowPosition.y}px`,
          '--qa-width': `${qaWindowSize.width}px`,
          '--qa-height': `${qaWindowSize.height}px`,
        }}
        onMouseDown={handleQaWindowDragStart}
      >
        <div className={styles.qaContent}>
          <div className={styles.qaPlaceholder}>
            질문과 답변받는 창만 중앙 고정
          </div>
        </div>
      </div>

      {/* Input Field - Fixed Position */}
      <div
        ref={inputContainerRef}
        className={`${styles.inputContainer} ${isCustomMode ? styles.draggable : ''}`}
        style={{
          '--input-x': `${inputPosition.x}px`,
          '--input-y': `${inputPosition.y}px`,
          '--input-width': `${inputSize.width}px`,
        }}
        onMouseDown={handleInputDragStart}
      >
        <input
          type="text"
          className={styles.messageInput}
          placeholder="메시지를 입력하세요..."
        />
      </div>

      </section>

      {/* Drawing Area - Scrollable workspace */}
      <div className={styles.chatDivider} />

      <section
        className={`${styles.drawingArea} ${isCustomMode ? styles.draggable : ''}`}
        style={{
          '--draw-x': `${drawingAreaPosition.x}px`,
          '--draw-y': `${drawingAreaPosition.y}px`
        }}
        onMouseDown={handleDrawingAreaDragStart}
      >
        <div className={styles.drawingHeader}>
          <h3 className={styles.drawingTitle}>캔버스 작업 영역</h3>
          <div className={styles.drawingToolsPanel}>
            <div className={styles.drawingToolsGroup}>
              <button
                className={styles.drawingToolBtn}
                onClick={() => handleAddCanvasItem('rect')}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                사각형
              </button>
              <button
                className={styles.drawingToolBtn}
                onClick={() => handleAddCanvasItem('circle')}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                원
              </button>
              <button
                className={`${styles.drawingToolBtn} ${isLineMode ? styles.drawingToolActive : ''}`}
                onClick={() => {
                  setIsLineMode((prev) => !prev);
                  setIsConnectMode(false);
                  setConnectFrom(null);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                선
              </button>
              <button
                className={styles.drawingToolBtn}
                onClick={() => handleAddCanvasItem('arrow')}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                화살표
              </button>
              <button
                className={styles.drawingToolBtn}
                onClick={() => handleAddCanvasItem('text')}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                텍스트
              </button>
              <button
                className={styles.drawingToolBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenTableModal();
                }}
                type="button"
              >
                표
              </button>
              <button
                className={styles.drawingToolBtn}
                onClick={() => canvasFileInputRef.current?.click()}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                이미지
              </button>
              <input
                ref={canvasFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                className={styles.drawingFileInput}
              />
            </div>
            <div className={styles.drawingToolsGroup}>
              <button
                className={styles.drawingToolBtn}
                onClick={handleDuplicateActiveCanvasItem}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                복제
              </button>
              <button
                className={styles.drawingToolBtn}
                onClick={handleDeleteActiveCanvasItem}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                삭제
              </button>
              <button
                className={styles.drawingToolBtn}
                onClick={handleSendToBack}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                맨 뒤로
              </button>
              <button
                className={`${styles.drawingToolBtn} ${isGroupMode ? styles.drawingToolActive : ''}`}
                onClick={() => {
                  setIsGroupMode((prev) => !prev);
                  setActiveCanvasGroupId(null);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                그룹
              </button>
            </div>
            <div className={styles.drawingToolsGroup}>
              <button
                className={`${styles.drawingToolBtn} ${isConnectMode ? styles.drawingToolActive : ''}`}
                onClick={() => {
                  setIsConnectMode((prev) => !prev);
                  setConnectFrom(null);
                  if (!isConnectMode) {
                    setIsLineMode(false);
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                연결선
              </button>
              <label className={styles.drawingColorLabel}>
                선색
                <input
                  type="color"
                  className={styles.drawingColorInput}
                  value={
                    canvasLinks.find((link) => link.id === activeCanvasLinkId)?.color ||
                    defaultLineColor
                  }
                  onChange={(e) => handleChangeActiveLinkColor(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </label>
              <label className={styles.drawingColorLabel}>
                굵기
                <select
                  className={styles.drawingSelect}
                  value={
                    canvasLinks.find((link) => link.id === activeCanvasLinkId)?.width ||
                    canvasItems.find(
                      (item) =>
                        item.id === activeCanvasItemId &&
                        (item.type === 'line' || item.type === 'arrow')
                    )?.strokeWidth ||
                    defaultStrokeWidth
                  }
                  onChange={(e) => handleChangeActiveLinkWidth(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </label>
              <input
                type="text"
                className={styles.drawingTextInput}
                placeholder="선 라벨"
                value={
                  canvasLinks.find((link) => link.id === activeCanvasLinkId)?.label || ''
                }
                onChange={(e) => handleChangeActiveLinkLabel(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={!activeCanvasLinkId}
              />
              <label className={styles.drawingColorLabel}>
                채우기
                <input
                  type="color"
                  className={styles.drawingColorInput}
                  value={
                    canvasItems.find((item) => item.id === activeCanvasItemId)?.fill ||
                    defaultFillColor
                  }
                  onChange={(e) => handleChangeActiveFill(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </label>
              <label className={styles.drawingColorLabel}>
                테두리
                <input
                  type="color"
                  className={styles.drawingColorInput}
                  value={
                    canvasItems.find((item) => item.id === activeCanvasItemId)?.borderColor ||
                    defaultBorderColor
                  }
                  onChange={(e) => handleChangeActiveBorderColor(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </label>
              <button
                className={`${styles.drawingToolBtn} ${showCanvasGrid ? styles.drawingToolActive : ''}`}
                onClick={() => setShowCanvasGrid((prev) => !prev)}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                그리드
              </button>
              <button
                className={`${styles.drawingToolBtn} ${snapToGrid ? styles.drawingToolActive : ''}`}
                onClick={() => setSnapToGrid((prev) => !prev)}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                스냅
              </button>
              <select
                className={styles.drawingSelect}
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <option value={10}>10px</option>
                <option value={20}>20px</option>
                <option value={30}>30px</option>
                <option value={40}>40px</option>
              </select>
              <button
                className={styles.drawingToolBtn}
                onClick={handleExportCanvas}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                저장
              </button>
              <button
                className={styles.drawingToolBtn}
                onClick={() => document.getElementById('canvas-import')?.click()}
                onMouseDown={(e) => e.stopPropagation()}
                type="button"
              >
                불러오기
              </button>
              <input
                id="canvas-import"
                type="file"
                accept="application/json"
                onChange={handleImportCanvas}
                className={styles.drawingFileInput}
              />
            </div>
          </div>
        </div>
        <div
          ref={drawingCanvasRef}
          className={`${styles.drawingCanvas} ${showCanvasGrid ? styles.drawingCanvasGrid : ''} ${
            isLineMode ? styles.drawingCanvasLineMode : ''
          }`}
          style={{ '--grid-size': `${gridSize}px` }}
          onMouseDown={(e) => {
            if (handleCanvasLineStart(e)) {
              e.stopPropagation();
              return;
            }
            e.stopPropagation();
            setActiveCanvasItemId(null);
            setActiveCanvasLinkId(null);
            setSelectedCanvasItemIds([]);
            if (isConnectMode) {
              setIsConnectMode(false);
              setConnectFromId(null);
            }
            const point = getCanvasPoint(e);
            if (point) {
              setIsSelectingCanvasItems(true);
              setCanvasSelectionRect({
                x: point.x,
                y: point.y,
                width: 0,
                height: 0,
                startX: point.x,
                startY: point.y
              });
              setSelectedCanvasItemIds([]);
            }
          }}
        >
          {canvasSelectionRect && (
            <div
              className={styles.canvasSelectionRect}
              style={{
                left: `${canvasSelectionRect.x}px`,
                top: `${canvasSelectionRect.y}px`,
                width: `${canvasSelectionRect.width}px`,
                height: `${canvasSelectionRect.height}px`
              }}
            />
          )}
          <svg className={styles.canvasLinks} aria-hidden="true">
            {canvasLinks.map((link) => {
              const path = getConnectionPath(link);
              const endpoints = getLinkEndpoints(link);
              const labelPos = getConnectionLabelPos(link);
              const handlePos = getConnectionHandlePos(link);
              if (!path) return null;
              return (
                <g key={link.id}>
                  <defs>
                    <marker
                      id={`link-arrow-${link.id}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path
                        d="M0,0 L0,6 L9,3 z"
                        fill={link.color || defaultLineColor}
                      />
                    </marker>
                  </defs>
                  <path
                    d={path}
                    fill="none"
                    stroke={link.color || defaultLineColor}
                    strokeWidth={link.id === activeCanvasLinkId ? (link.width || 3) + 1 : link.width || 3}
                    markerEnd={`url(#link-arrow-${link.id})`}
                    className={styles.canvasLinkLine}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setActiveCanvasLinkId(link.id);
                      setActiveCanvasItemId(null);
                    }}
                  />
                  {link.label && labelPos && (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      className={styles.canvasLinkLabel}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveCanvasLinkId(link.id);
                        setActiveCanvasItemId(null);
                      }}
                    >
                      {link.label}
                    </text>
                  )}
                  {link.id === activeCanvasLinkId && endpoints && (
                    <>
                      <circle
                        className={styles.canvasLinkHandle}
                        cx={endpoints.start.x}
                        cy={endpoints.start.y}
                        r="6"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setLinkDrag({ id: link.id, type: 'from' });
                        }}
                      />
                      <circle
                        className={styles.canvasLinkHandle}
                        cx={endpoints.end.x}
                        cy={endpoints.end.y}
                        r="6"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setLinkDrag({ id: link.id, type: 'to' });
                        }}
                      />
                    </>
                  )}
                  {link.id === activeCanvasLinkId && handlePos && (
                    <circle
                      className={styles.canvasLinkHandleMid}
                      cx={handlePos.x}
                      cy={handlePos.y}
                      r="6"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setLinkDrag({ id: link.id, type: 'bend' });
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
          {lineDraft && (
            <svg className={styles.canvasLineDraft} aria-hidden="true">
              <line
                x1={lineDraft.startX}
                y1={lineDraft.startY}
                x2={lineDraft.endX}
                y2={lineDraft.endY}
                stroke="#2f5f9e"
                strokeWidth="3"
              />
            </svg>
          )}
          {canvasItems.length === 0 && (
            <div className={styles.drawingPlaceholder}>
              도형/텍스트/이미지 등을 배치할 수 있는 영역입니다.
            </div>
          )}
          {canvasItems.map((item) => {
            const isSelected =
              activeCanvasItemId === item.id ||
              (selectedCanvasItemIds && selectedCanvasItemIds.includes(item.id));

            return (
            <div
              key={item.id}
              className={`${styles.canvasItem} ${styles[`canvasItem${item.type}`]} ${
                isSelected && item.type !== 'line' && item.type !== 'arrow'
                  ? styles.canvasItemActive
                  : ''
              }`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                backgroundColor:
                  item.type === 'arrow' || item.type === 'line' || item.type === 'text'
                    ? 'transparent'
                    : item.fill || undefined,
                border: item.type === 'arrow' || item.type === 'line' ? 'none' : undefined,
                borderColor:
                  item.type === 'arrow' || item.type === 'line'
                    ? 'transparent'
                    : item.borderColor || '#4A90E2',
                boxShadow: item.type === 'arrow' || item.type === 'line' ? 'none' : undefined
              }}
              onMouseDown={(e) => handleCanvasItemDragStart(e, item.id)}
              onClick={(e) => handleCanvasItemClick(e, item.id)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (item.type === 'text' || item.type === 'rect' || item.type === 'circle') {
                  setActiveCanvasItemId(item.id);
                  setSelectedCanvasItemIds([item.id]);
                  setTextModalTargetId(item.id);
                  setTextModalTableTarget(null);
                  setTextModalContent(item.text || '');
                  setIsTextModalOpen(true);
                }
              }}
            >
              {item.type === 'text' ? (
                <span
                  className={styles.canvasItemLabel}
                  style={{ color: item.textColor || defaultTextColor }}
                  dangerouslySetInnerHTML={{ __html: item.text || '텍스트' }}
                />
              ) : item.type === 'image' ? (
                <img src={item.src} alt="canvas" className={styles.canvasImage} draggable="false" />
              ) : item.type === 'table' ? (
                <>
                  <table className={styles.canvasTable}>
                    <tbody>
                      {Array.from({ length: item.rows || 1 }).map((_, rowIdx) => (
                        <tr key={rowIdx}>
                          {Array.from({ length: item.cols || 1 }).map((_, colIdx) => {
                            // 병합된 셀인지 확인 (다른 셀의 병합 범위에 포함된 경우)
                            const isMerged = (() => {
                              for (let r = 0; r <= rowIdx; r++) {
                                for (let c = 0; c <= colIdx; c++) {
                                  if (r === rowIdx && c === colIdx) continue;
                                  const rowspan = item.cellRowspans?.[r]?.[c] || 1;
                                  const colspan = item.cellColspans?.[r]?.[c] || 1;
                                  if (
                                    r <= rowIdx &&
                                    rowIdx < r + rowspan &&
                                    c <= colIdx &&
                                    colIdx < c + colspan &&
                                    (r !== rowIdx || c !== colIdx)
                                  ) {
                                    return true;
                                  }
                                }
                              }
                              return false;
                            })();

                            // 병합된 셀은 렌더링하지 않음
                            if (isMerged) return null;

                            const rowspan = item.cellRowspans?.[rowIdx]?.[colIdx] || 1;
                            const colspan = item.cellColspans?.[rowIdx]?.[colIdx] || 1;

                            return (
                              <td
                                key={colIdx}
                                rowSpan={rowspan > 1 ? rowspan : undefined}
                                colSpan={colspan > 1 ? colspan : undefined}
                                style={{
                                  borderColor: item.borderColor || defaultBorderColor,
                                  color:
                                    (item.cellColors &&
                                      item.cellColors[rowIdx] &&
                                      item.cellColors[rowIdx][colIdx]) ||
                                    item.textColor ||
                                    defaultTextColor
                                }}
                                // 표 셀은 직접 편집하지 않고 모달로만 편집
                                contentEditable={false}
                                suppressContentEditableWarning
                                onClick={(e) => {
                                  // 셀 선택 (색상/병합 대상)
                                  e.stopPropagation();
                                  setActiveCanvasItemId(item.id);
                                  setSelectedCanvasItemIds([item.id]);
                                  setActiveTableCell({ tableId: item.id, row: rowIdx, col: colIdx });
                                }}
                                onDoubleClick={(e) => {
                                  // 더블클릭 시 셀 텍스트 편집 모달 오픈
                                  e.stopPropagation();
                                  setActiveCanvasItemId(item.id);
                                  setSelectedCanvasItemIds([item.id]);
                                  setActiveTableCell({ tableId: item.id, row: rowIdx, col: colIdx });
                                  setTextModalTargetId(null);
                                  setTextModalTableTarget({
                                    tableId: item.id,
                                    row: rowIdx,
                                    col: colIdx
                                  });
                                  const currentText =
                                    (item.cells &&
                                      item.cells[rowIdx] &&
                                      item.cells[rowIdx][colIdx]) ||
                                    '';
                                  setTextModalContent(currentText);
                                  setIsTextModalOpen(true);
                                }}
                              >
                                <div
                                  className={styles.canvasTableCellContent}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      (item.cells &&
                                        item.cells[rowIdx] &&
                                        item.cells[rowIdx][colIdx]) ||
                                      ''
                                  }}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isSelected && (
                    <div className={styles.canvasTableToolbar}>
                      {editingTableId === item.id ? (
                        <>
                          <button
                            type="button"
                            className={styles.canvasTableToolbarBtn}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModifyTable(item.id, 'colRightPlus');
                            }}
                          >
                            오른쪽 열+
                          </button>
                          <button
                            type="button"
                            className={styles.canvasTableToolbarBtn}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModifyTable(item.id, 'colLeftPlus');
                            }}
                          >
                            왼쪽 열+
                          </button>
                          <button
                            type="button"
                            className={styles.canvasTableToolbarBtn}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModifyTable(item.id, 'rowTopPlus');
                            }}
                          >
                            위 행+
                          </button>
                          <button
                            type="button"
                            className={styles.canvasTableToolbarBtn}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModifyTable(item.id, 'rowBottomPlus');
                            }}
                          >
                            아래 행+
                          </button>
                          <button
                            type="button"
                            className={`${styles.canvasTableToolbarBtn} ${styles.canvasTableToolbarDelete}`}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModifyTable(item.id, 'colRightMinus');
                            }}
                          >
                            오른쪽 열-
                          </button>
                          <button
                            type="button"
                            className={`${styles.canvasTableToolbarBtn} ${styles.canvasTableToolbarDelete}`}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModifyTable(item.id, 'colLeftMinus');
                            }}
                          >
                            왼쪽 열-
                          </button>
                          <button
                            type="button"
                            className={`${styles.canvasTableToolbarBtn} ${styles.canvasTableToolbarDelete}`}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModifyTable(item.id, 'rowTopMinus');
                            }}
                          >
                            위 행-
                          </button>
                          <button
                            type="button"
                            className={`${styles.canvasTableToolbarBtn} ${styles.canvasTableToolbarDelete}`}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModifyTable(item.id, 'rowBottomMinus');
                            }}
                          >
                            아래 행-
                          </button>
                        <button
                          type="button"
                          className={styles.canvasTableToolbarBtn}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMergeCellLeft(item.id);
                          }}
                          disabled={
                            !activeTableCell ||
                            activeTableCell.tableId !== item.id ||
                            (() => {
                              const startPos = findMergeStart(item, activeTableCell.row, activeTableCell.col);
                              return startPos.col <= 0;
                            })()
                          }
                        >
                          왼쪽 병합
                        </button>
                          <button
                            type="button"
                            className={styles.canvasTableToolbarBtn}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMergeCellRight(item.id);
                            }}
                            disabled={
                              !activeTableCell ||
                              activeTableCell.tableId !== item.id ||
                              (() => {
                                const startPos = findMergeStart(item, activeTableCell.row, activeTableCell.col);
                                const currentColspan = item.cellColspans?.[startPos.row]?.[startPos.col] || 1;
                                return startPos.col + currentColspan >= (item.cols || 1);
                              })()
                            }
                          >
                            오른쪽 병합
                        </button>
                        <button
                          type="button"
                          className={styles.canvasTableToolbarBtn}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMergeCellUp(item.id);
                          }}
                          disabled={
                            !activeTableCell ||
                            activeTableCell.tableId !== item.id ||
                            (() => {
                              const startPos = findMergeStart(item, activeTableCell.row, activeTableCell.col);
                              return startPos.row <= 0;
                            })()
                          }
                        >
                          위 병합
                          </button>
                          <button
                            type="button"
                            className={styles.canvasTableToolbarBtn}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMergeCellDown(item.id);
                            }}
                            disabled={
                              !activeTableCell ||
                              activeTableCell.tableId !== item.id ||
                              (() => {
                                const startPos = findMergeStart(item, activeTableCell.row, activeTableCell.col);
                                const currentRowspan = item.cellRowspans?.[startPos.row]?.[startPos.col] || 1;
                                return startPos.row + currentRowspan >= (item.rows || 1);
                              })()
                            }
                          >
                            아래 병합
                          </button>
                          <button
                            type="button"
                            className={styles.canvasTableToolbarBtn}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnmergeCell(item.id);
                            }}
                            disabled={
                              !activeTableCell || activeTableCell.tableId !== item.id
                            }
                          >
                            병합 해제
                          </button>
                          <button
                            type="button"
                            className={`${styles.canvasTableToolbarBtn} ${styles.canvasTableToolbarClose}`}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTableId(null);
                            }}
                          >
                            닫기
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={styles.canvasTableToolbarBtn}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTableId(item.id);
                          }}
                        >
                          수정
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : item.type === 'arrow' ? (
                <svg className={styles.canvasArrow} viewBox={`0 0 ${item.width} ${item.height}`}>
                  <defs>
                    <marker
                      id={`arrow-${item.id}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path
                        d="M0,0 L0,6 L9,3 z"
                        fill={item.fill || defaultLineColor}
                      />
                    </marker>
                  </defs>
                  <line
                    x1="0"
                    y1="0"
                    x2={item.width}
                    y2={item.height}
                    stroke={item.fill || defaultLineColor}
                    strokeWidth="3"
                    markerEnd={`url(#arrow-${item.id})`}
                  />
                </svg>
              ) : item.type === 'line' ? (
                (() => {
                  const strokeWidth = item.strokeWidth || 3;
                  const padding = Math.ceil(strokeWidth / 2);
                  const endpoints = getLineEndpoints(item);
                  if (endpoints) {
                    const startX = endpoints.start.x - item.x + padding;
                    const startY = endpoints.start.y - item.y + padding;
                    const endX = endpoints.end.x - item.x + padding;
                    const endY = endpoints.end.y - item.y + padding;
                    return (
                      <svg className={styles.canvasLine} viewBox={`0 0 ${item.width} ${item.height}`} style={{ overflow: 'visible' }}>
                        <line
                          x1={startX}
                          y1={startY}
                          x2={endX}
                          y2={endY}
                          stroke={item.fill || '#2f5f9e'}
                          strokeWidth={strokeWidth}
                          strokeLinecap="butt"
                        />
                      </svg>
                    );
                  }
                  const startX = item.startX !== undefined ? item.startX - item.x + padding : padding;
                  const startY = item.startY !== undefined ? item.startY - item.y + padding : padding;
                  const endX = item.endX !== undefined ? item.endX - item.x + padding : item.width - padding;
                  const endY = item.endY !== undefined ? item.endY - item.y + padding : item.height - padding;
                  return (
                    <svg className={styles.canvasLine} viewBox={`0 0 ${item.width} ${item.height}`} style={{ overflow: 'visible' }}>
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={item.fill || '#2f5f9e'}
                        strokeWidth={strokeWidth}
                        strokeLinecap="butt"
                      />
                    </svg>
                  );
                })()
              ) : item.type === 'rect' || item.type === 'circle' ? (
                <span
                  className={styles.canvasItemLabel}
                  style={{ color: item.textColor || defaultTextColor }}
                  dangerouslySetInnerHTML={{ __html: item.text || '' }}
                />
              ) : (
                <span className={styles.canvasItemLabel}>도형</span>
              )}
              {item.type === 'line' && isSelected && (
                (() => {
                  const endpoints = getLineEndpoints(item);
                  const startPoint = endpoints ? endpoints.start : { x: item.startX ?? item.x, y: item.startY ?? item.y };
                  const endPoint = endpoints ? endpoints.end : { x: item.endX ?? item.x + item.width, y: item.endY ?? item.y + item.height };
                  return (
                    <>
                      <button
                        className={styles.canvasLineHandle}
                        style={{
                          left: `${startPoint.x - item.x - 6}px`,
                          top: `${startPoint.y - item.y - 6}px`
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setLineDrag({ id: item.id, handle: 'start' });
                        }}
                        type="button"
                      />
                      <button
                        className={styles.canvasLineHandle}
                        style={{
                          left: `${endPoint.x - item.x - 6}px`,
                          top: `${endPoint.y - item.y - 6}px`
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setLineDrag({ id: item.id, handle: 'end' });
                        }}
                        type="button"
                      />
                    </>
                  );
                })()
              )}
              {isConnectMode && !['line', 'arrow'].includes(item.type) && (
                <>
                  <button
                    className={`${styles.canvasPort} ${styles.canvasPortTop}`}
                    onMouseDown={(e) => handleCanvasPortClick(e, item.id, 'top')}
                    type="button"
                  />
                  <button
                    className={`${styles.canvasPort} ${styles.canvasPortRight}`}
                    onMouseDown={(e) => handleCanvasPortClick(e, item.id, 'right')}
                    type="button"
                  />
                  <button
                    className={`${styles.canvasPort} ${styles.canvasPortBottom}`}
                    onMouseDown={(e) => handleCanvasPortClick(e, item.id, 'bottom')}
                    type="button"
                  />
                  <button
                    className={`${styles.canvasPort} ${styles.canvasPortLeft}`}
                    onMouseDown={(e) => handleCanvasPortClick(e, item.id, 'left')}
                    type="button"
                  />
                </>
              )}
              {isSelected && item.type !== 'arrow' && item.type !== 'line' && (
                <>
                  <button
                    className={`${styles.canvasResizeHandle} ${styles.canvasResizeHandleNW}`}
                    onMouseDown={(e) => handleCanvasResizeStart(e, item.id, 'nw')}
                    type="button"
                  />
                  <button
                    className={`${styles.canvasResizeHandle} ${styles.canvasResizeHandleNE}`}
                    onMouseDown={(e) => handleCanvasResizeStart(e, item.id, 'ne')}
                    type="button"
                  />
                  <button
                    className={`${styles.canvasResizeHandle} ${styles.canvasResizeHandleSW}`}
                    onMouseDown={(e) => handleCanvasResizeStart(e, item.id, 'sw')}
                    type="button"
                  />
                  <button
                    className={`${styles.canvasResizeHandle} ${styles.canvasResizeHandleSE}`}
                    onMouseDown={(e) => handleCanvasResizeStart(e, item.id, 'se')}
                    type="button"
                  />
                </>
              )}
            </div>
            );
          })}
        </div>
      </section>

      {isTemplateModalOpen && (
        <div
          className={styles.templateModalOverlay}
          onClick={() => setIsTemplateModalOpen(false)}
        >
          <div
            className={styles.templateModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.templateModalHeader}>
              <h3 className={styles.templateModalTitle}>화면 템플릿</h3>
              <button
                className={styles.templateModalClose}
                onClick={() => setIsTemplateModalOpen(false)}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className={styles.templateModalBody}>
              <div className={styles.templateSection}>
                <div className={styles.templateSectionTitle}>샘플 템플릿</div>
                <div className={styles.templateList}>
                  {sampleTemplates.map((template) => (
                    <button
                      key={template.id}
                      className={styles.templateItem}
                      onClick={() => handleApplyTemplate(template)}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.templateSection}>
                <div className={styles.templateSectionTitle}>내 템플릿</div>
                <div className={styles.templateList}>
                  {savedTemplates.length === 0 && (
                    <div className={styles.templateEmpty}>저장된 템플릿이 없습니다.</div>
                  )}
                  {savedTemplates.map((template) => (
                    <div key={template.id} className={styles.templateRow}>
                      <button
                        className={styles.templateItem}
                        onClick={() => handleApplyTemplate(template)}
                      >
                        {template.name}
                      </button>
                      <button
                        className={styles.templateDelete}
                        onClick={() => handleDeleteTemplate(template.id)}
                        aria-label="템플릿 삭제"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.templateSaveRow}>
                  <input
                    type="text"
                    className={styles.templateInput}
                    placeholder="현재 화면 저장 이름"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                  <button
                    className={styles.templateSaveBtn}
                    onClick={handleSaveTemplate}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTableModalOpen && (
        <div
          className={styles.templateModalOverlay}
        >
          <div
            className={styles.templateModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.templateModalHeader}>
              <h3 className={styles.templateModalTitle}>표 만들기</h3>
              <button
                className={styles.templateModalClose}
                onClick={() => setIsTableModalOpen(false)}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className={styles.templateModalBody}>
              <div className={styles.templateSection}>
                <div className={styles.templateSectionTitle}>행 / 열 개수</div>
                <div className={styles.tableInputRow}>
                  <label className={styles.tableLabel}>
                    행
                    <input
                      type="number"
                      min="1"
                      className={styles.templateInput}
                      value={tableRows}
                      onChange={(e) => setTableRows(e.target.value)}
                    />
                  </label>
                  <label className={styles.tableLabel}>
                    열
                    <input
                      type="number"
                      min="1"
                      className={styles.templateInput}
                      value={tableCols}
                      onChange={(e) => setTableCols(e.target.value)}
                    />
                  </label>
                </div>
              </div>
              <div className={styles.tableModalFooter}>
                <button
                  className={styles.templateDelete}
                  onClick={() => setIsTableModalOpen(false)}
                  type="button"
                >
                  취소
                </button>
                <button
                  className={styles.templateSaveBtn}
                  onClick={handleConfirmTableModal}
                  type="button"
                >
                  생성
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTextModalOpen && (
        <div
          className={styles.templateModalOverlay}
        >
          <div
            className={`${styles.templateModal} ${styles.textEditorModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.templateModalHeader}>
              <h3 className={styles.templateModalTitle}>텍스트 편집</h3>
              <button
                className={styles.templateModalClose}
                onClick={() => setIsTextModalOpen(false)}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className={`${styles.templateModalBody} ${styles.textEditorBody}`}>
              <RichTextEditor
                value={textModalContent}
                onChange={setTextModalContent}
                className={styles.memoWindowTextarea}
                placeholder="텍스트를 입력하세요..."
              />
            </div>
            <div className={styles.tableModalFooter}>
              <button
                className={styles.templateDelete}
                onClick={() => setIsTextModalOpen(false)}
                type="button"
              >
                취소
              </button>
              <button
                className={styles.templateSaveBtn}
                onClick={handleTextModalApply}
                type="button"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memo Windows - Sticky Notes */}
      {memos.map((memo) => (
        <div
          key={memo.id}
          className={styles.memoWindow}
          style={{
            left: `${memo.position.x}px`,
            top: `${memo.position.y}px`,
            width: `${memo.size.width}px`,
            height: `${memo.size.height}px`,
          }}
        >
          <div 
            className={styles.memoWindowHeader}
            onMouseDown={(e) => handleMemoDragStart(e, memo.id)}
          >
            <input
              type="text"
              className={styles.memoTitleInput}
              value={memo.title}
              onChange={(e) => handleMemoTitleChange(memo.id, e.target.value)}
              placeholder="메모 이름"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
            <button
              className={styles.deleteMemoBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMemo(memo.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="메모 삭제"
            >
              ×
            </button>
          </div>
          <textarea
            className={styles.memoWindowTextarea}
            value={memo.content}
            onChange={(e) => handleMemoContentChange(memo.id, e.target.value)}
            placeholder="메모를 입력하세요..."
          />
        </div>
      ))}
    </div>
    </AppShell>
  );
}
